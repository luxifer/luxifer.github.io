---
layout: post
title: Les bonnes pratiques de développement - partie 2
tags:
- dev
- développement
- équipe
- team
status: publish
type: post
published: true
meta:
  thumb: false
---
Parties : [[1](/2015/03/20/bonnes-pratiques-de-developpement-partie-1/)][2]

Dans la première partie de ce sujet j'ai plus parlé du côté humain dans le développement, aujourd'hui on va rentrer dans le code et savoir ce qu'il faut faire pour qu'un projet dure sans devenir _legacy_.

## Disclaimer

Tout ce que je vais écrire dans cette série d'article reflète uniquement ma propre opinion.

## Gestion des dépendances

Le plus important dans un projet, et surtout en équipe c'est la gestion des dépendances, non seulement applicative, mais aussi logicielle, et même matérielle (au moins virtuelle) quand c'est possible.

Les dépendances applicatives c'est quoi ? Ceci sont les _vendors_ de son application. Typiquement définie dane ton `composer.json`, `Gemfile`, `requirements.txt`, etc. Pour garder la même version de ces dépendances sur tous les postes de tous les développeurs est assez simple. A peu près chaque système de gestion de dépendance stocke dans le répertoire du projet un fichier dans lequel il indique toutes les versions de tous les _vendors_ installés. Avec _composer_ c'est le fichier `composer.lock`. Très important de le versionner, ainsi les vendors seront les même en dev, _CI_, stagging, prod, etc.

Les dépendances logicielles c'est quoi ? Ceci sont les logiciels nécessaires pour faire tourner son application. Pour une application _Symfony_ il s'agit d'un Nginx, de PHP et sûrement de MySQL. Alors en équipe ou même tout seul, je déconseille fortement d'installer manuellement ces dépendances. Car on va se retrouver avec une version de nginx en local, une autre en CI et encore une autre en prod. C'est le meilleur moyen de laisser passer des erreurs pour les voir seulement en prod, trop tard... Ce que je conseille plutôt c'est d'utiliser [vagrant](https://www.vagrantup.com/) ou encore mieux [docker](https://www.docker.com/).

Vagrant par exemple, permet de créer une machine virtuelle, de dire comment la provisionner, c'est à dire qu'est-ce qu'il faut installer dessus et ensuite on peut partager cette machine virtuelle entre tous les collaborateurs du projet. Comme ça tout le monde à la même version des mêmes logiciels d'installés.

Ensuite Docker. Ça peut être un meilleur choix si tout le monde est sous linux. Car en plus de pouvoir utiliser les mêmes images en dev, ces images pourront servir en _CI_ et pourquoi pas en prod. Je dis sous linux seulement car actuellement, sous mac ou windows, la seule façon d'utiliser docker est de passer par [boot2docker](http://boot2docker.io/) et il y a certains problèmes au niveau du partage de fichiers entre l'hôte et la machine virtuelle qui contient docker, voir [ici](https://github.com/boot2docker/boot2docker/issues/581).

Revenons à vagrant, ça règle les problèmes de la dev, mais pas de la prod ni de la _CI_. C'est à dire qu'il nous faut encore installer manuellement nos dépendances logicielle. Il existe des solutions pour ça comme [ansible](http://www.ansible.com/home). Un peu comme Chef ou Puppet, ces solutions permettent de transposer en code la façon d'installer ses dépendances, et donc de pouvoir versionner tout ça. Ainsi, on peut utiliser ces _recettes_ pour notre vagrant, mais aussi en _CI_ et en prod. Comme ça on est à peu près sûr de pouvoir reproduire un bug de prod en local.

Les dépendances matérielles c'est quoi ? C'est le matériel qu'on utilise pour développer, faire tourner sa prod, etc. Autant que possible, si plusieurs personnes travaillent sur un même projet, qu'elles aient le même matériel (un MacBook Pro 13" Retina c'est parfait :D). Après si on utilise vagrant ça limite la casse de ce côté là car on émule les ressources, elles seront donc les mêmes pour tout le monde dans la machine virtuelle.

En prod on utilise forcément pas le même matériel, par contre on peut essayer d'avoir une architecture similaire à la prod en dev. Je dis bien similaire car si on a 50 frontaux avec du load balancing, 10 MySQL et 20 Redis, ça va être compliqué d'avoir la même chose sur sa seule machine de dev.

## Tests

On attaque une grosse partie, les tests. Alors je ne suis pas un fou furieux du TDD ou BDD, mais j'essaye d'utiliser les deux en fonction du besoin. Actuellement, je travaille sur Xotelia. À l'origine c'est un gros projet monolithique basé sur un framework maison. Autant dire que se mettre à faire du TDD la dedans c'était du suicide. Par contre le BDD s'y prête bien. Au fur et à mesure de l'apprentissage du projet j'ai pu mettre en place quelques briques de BDD pour valider certaines fonctionnalités, à commencer par le login.

C'est grâce à cet effort de fond que j'ai pu transformer ce lourd framework maison et hybride Symfony. Qui est devenu beaucoup agréable pour développer et avoir des bons retours d'erreurs.

Tout ça pour dire que l'utilisation du TDD ou du BDD se fait au jugement. Il ne faut pas foncer tête baissée. Comme cité plus haut, pour le cas d'un projet _legacy_, le TDD est exclu. Trop complexe à mettre en place et à maintenir, pour au final quel gain ? Au contraire sur un nouveau projet, le TDD s'avère très utile. À bon escient, il permet de développer de manière moins couplée, de valider le fonctionnement de ses classes, etc. Par contre il n'est pas nécessaire de faire du TDD pour **tout**. Inutile de tester un _controller_ Symfony, c'est déjà fait au niveau du framework. De plus la logique métier ne doit pas se situer dans le _controller_ (dans le meilleur des mondes).

Ensuite pour une API _rest_ par exemple, pas besoin non plus de faire de TDD. Seul ce qui importe dans une API c'est son interface, qu'elle soit consistante et une fois déployée en prod, qu'elle ne change pas. Donc peut importe le mécanisme derrière une API ce qu'il faut valider c'est la sortie. Et là une fois de plus le BDD s'y prête à merveille.

Je recommande de lire [cet article](http://everzet.com/post/107204911916/economy-of-tests) pour un point de vue plus détaillé sur les tests.

## Code review

Quand on travaille en équipe on ne peut pas se permettre de _pusher_ directement sur le master les yeux fermés. On risque d'introduire des bugs, d'avoir oublier des choses, il va être difficile de revenir en arrière, etc. Il vaut mieux dans ce cas utiliser le système de _Pull Request_ de GitHub, ou les _Merge Request_ de Bitbucket. Voire pourquoi pas se coupler à un vrai système de code review comme [gerrit](https://code.google.com/p/gerrit/), pas très sexy mais très puissant.

Il est très important de faire relire son code par au moins une autre personne. Ça permet de détecter les oublis de `;`, un développement manquant, une autre façon de faire les choses, etc. Couplé à un système de branche, on se retrouve avec un historique clair, on peut savoir quelles features ont été _mergées_ a quel moment et on peut facilement revenir en arrière si besoin.

## Conclusion

J'espère que vous pratiquez déjà tout ça. Si non il est temps de s'y mettre. n'hésitez pas à me donner vos impressions et vos bonne pratiques dans les commentaires. J'en intégrerai peut-être certaines à cet article.
