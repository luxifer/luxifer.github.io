---
layout: post
title: Déploiement avec Go et Ansible dans Docker
tags:
- golang
- docker
- ansible
layout: post
published: true
meta:
  thumb: false
---
La semaine dernière je me suis mis en tête de développer une application afin de centraliser tous les déploiements qu'on fait à [Xotelia](https://www.xotelia.com). J'ai fais le tour et il existe en SaaS ou en Open source des solutions pour ça. Je n'en ai pas trouvé qui fonctionne avec ansible (bien que lors d'un déploiement on puisse installer ce qu'on veut), ou alors trop cher. De plus on ne déploie pas chaque branche, seulement _master_ ou une feature-branch qu'on veut tester sur un environnement différent de la production. C'est la que j'ai décidé de développer notre propre outil de déploiement. À savoir que sur chacun de nos projets nous avons un playbook ansible de déploiement, mais que jusqu'à maintenant on les lance sur nos propres machines. Il me fallait aussi un outil qui me permette de lancer une commander dans hipchat pour déclencher un déploiement.

Étant un grand fan de [go](/2015/03/13/pourquoi-choisir-go/) et de docker je me suis dit que ça serait pas mal de pouvoir lancer un container docker, dans lequel je lance ansible, et avoir par dessus un petit frontent avec un flux des logs.

J'ai donc commencé a chercher un client docker en go et je suis tombé sur [celui-la](https://github.com/docker/engine-api). Il me semblait qu'il n'y en avait pas a part dans le core de docker ou alors développé par des tiers, mais je me suis trompé. Et qui plus est, très bien documenté et _idiomatic_.

Pour le stockage des résultats des builds je me suis tourné vers [RethinkDB](https://www.rethinkdb.com/). Une base de données NoSQL.

Le principe de fonctionnement est simple, quand je reçois un événement de déploiement depuis github, je crée un container à partir d'une image qui contient ansible. Dans ce container je clone le dépôt à déployer et je lance le playbook ansible. Je notifie github et hipchat de l'état du déploiement via leurs API respective. Une fois le déploiement terminé je supprime le container.

## Les embûches

Je suis tombé sur plusieurs problèmes lors du développement de ce projet. Tout d'abord il faut savoir que quand dans la console on lance `docker run` en fait en interne docker va faire un `create` puis un `start`.

Ensuite il faut que depuis ce container je puisse me connecter en ssh sur les serveurs sur lesquels je vais déployer mes projets, et que je puisse aussi cloner les projets que je vais déployer. Pour ce faire je passe en `bind` la clé SSH de l'hôte sur lequel est installé `deployer` vers le root du container comme ceci :

```go
import "github.com/docker/engine-api/types/container"

hostConfig := container.HostConfig{
    Binds: []string{"/home/deployer/.ssh/id_rsa:/root/.ssh/id_rsa"},
}
```

Je crée donc mon container avec cette configuration, et je le lance. Comme je ne m'attache pas a celui-ci, tout se passe en background. Donc il faut que j'attende la fin de l'exécution pour récupérer l'exit code.

```go
exitCode, err := dockerClient.ContainerWait(ctx, container.ID)
```

Je fais beaucoup d'appels à l'API docker dans la même fonction et donc beaucoup d'erreur à gérer. Comme go permet de retourner plusieurs éléments par fonction, à chaque fois que j'ai une erreur, je la remonte. Il me faut donc un moyen pour arrêter le container en cours à la moindre erreur pour ne pas laisser de déchêts sur la route. C'est la qu'intervient le mot-clé `defer`. Ce mot-clé permet de définir un comportement qui sera exécuté juste avant le retour d'une fonction. Très pratique pour fermer un fichier ou un `io.Reader`.

On arrive à la partie la plus intéressante, que j'ai fais en deux fois. La récupération des logs du container une fois l'exécution terminée.

```go
import "github.com/docker/engine-api/types"

logOpts := types.ContainerLogsOptions{
    ContainerID: container.ID,
    ShowStdout:  true,
    ShowStderr:  true,
    Follow:      true,
}
```

Ce qui a été exécuté dans le container a peut–être écrit dans la sortie standard ou la sortie d'erreur. Il faut donc que je récupère les deux. C'est la que je suis tombé sur une partir qui manque de documentation. Quand on demande à l'API docker les logs d'un container avec les deux sorties, docker va les multiplexer pour les mettre dans le même `io.Reader`. Et pour savoir sur quelle sortie correspond quelle ligne, docker va rajouter un header à chaque ligne pour indiquer si ça correspond a `stdin`, `stdout` ou `stderr`.

Il faut donc je de démultiplexe ce que me renvoit docker pour avoir un résultat lisible. En fouyant un peu sur github et google, je suis tombé sur ce [petit package](https://godoc.org/github.com/docker/docker/pkg/stdcopy) dans le projet docker. et en particulier la fonction [`StdCopy`](https://godoc.org/github.com/docker/docker/pkg/stdcopy#StdCopy). Cette fonction permet de démultiplexer une source (`io.Reader`) et d'écrire `stdout` et `stderr` vers deux `io.Writer` distinct.

Et voilà le tour est joué, j'ai mes logs propre pour chaque déploiement. Sauf que les problèmes ne s'arrêtent pas là. J'ai voulu rajouter de la couleur dans ces logs. Car la commande ansible écrit sur `stdout` avec différentes couleurs. Pour ce faire il faut que le terminal utilisé supporte la couleur. Il suffit de rajouter `ENV TERM xterm` dans le `Dockerfile` du container et ansible va pouvoir afficher de la couleur. Mais ce n'est pas tout, il faut aussi dire à docker d'utiliser un pseudo terminal (PTY) pour le container sinon cette variable d'environnement ne servira a rien. Pour ça il faut modifier la configuration utilisée pour créer le container :

```go
import "github.com/docker/engine-api/types/container"

config := container.Config{
    [...]
    Tty:       true,
    OpenStdin: true,
    [...]
}
```

Mais voilà, en rajoutant cette configuration, quand on récuère les logs, docker ne va pas multiplexer les sorties `stdin` et `stdout` mais va renvoyer la sortie brut du pseudo terminal. Donc il ne faut plus utiliser `stdcopy.StdCopy`.

Comme je l'ai dit plus haut, je voulais avoir une page pour suivre le déploiement et afficher le flux des logs. J'avais deux possibilités pour ça, soit utiliser les [Websocket](https://developer.mozilla.org/fr/docs/WebSockets) ou [Server-sent event](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events). Le premier est en full duplexe, c'est à dire que le serveur et le client peuvent écrire dedans. Le deuxième est dans un sens seulement, le serveur envoi des messages au client. Je suis parti sur Server-sent event, car je n'ai pas besoin que le client (la page web) envoi de message au serveur.

Côté serveur, j'utilise un petit [package](https://godoc.org/github.com/manucorporat/sse) go qui me permet de créer les événements. Ensuite, pour que dans mon handler du flux je puisse renvoyer les logs sous la forme d'événements j'ai créé une `struct` qui contient un `http.ResponseWriter` et la quantité de data envoyée. Avec cette `struct` j'implémente l'interface `io.Writer`. Je me suis inspiré de ce que j'ai trouvé dans le projet [drone](https://github.com/drone/drone) :

```go
import (
    "http"
    "strconv"

    "github.com/manucorporat/sse"
)

type StreamWriter struct {
    writer http.ResponseWriter
    count  int
}

func (w *StreamWriter) Write(data []byte) (int, error) {
    var err = sse.Encode(w.writer, sse.Event{
        Id:    strconv.Itoa(w.count),
        Event: "message",
        Data:  string(data),
    })
    w.writer.(http.Flusher).Flush() // ne pas oublier de flush le ResponseWriter à chaque message pour que le serveur envoi l'événement au client.
    w.count += len(data)
    return len(data), err
}
```

Il ne me reste plus qu'a copier le `io.Reader` que me renvoi docker pour les logs dans cet `io.Writer`. Ne pas oublier de définir le `Content-Type` à `text/event-stream`.

```go
import (
    "http"
    "io"

    "github.com/manucorporat/sse"
)

func streamHandler(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", sse.ContentType)
    reader, _ := dockerClient.ContainerLogs(ctx, logOpts)
    writer := &StreamWriter{w, 0}
    io.Copy(writer, reader)
}
```

Je peux donc récupérer ces événements depuis la page du déploiement et les afficher.

## Résultat final

J'ai donc maintenant une application qui reçoit les événements de déploiement de github et qui lance le déploiement dans un container docker. Je peux suivre le tout dans une joli page web. Ainsi est né [Deployer](https://github.com/Xotelia/deployer).

La suite du projet ? Avoir une meilleure gestion des releases, savoir qui a déployer quoi à quel moment, un historique des commits déployés, une intégration avec une application github oauth pour simplifier l'ajout de projet à déployer, une sécurisation du webhook github avec un secret, etc. La liste est longue.
