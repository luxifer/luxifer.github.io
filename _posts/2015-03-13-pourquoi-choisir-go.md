---
layout: post
title: Pourquoi choisir Go
tags:
- go
- golang
status: publish
type: post
published: true
meta:
  thumb: false
---
Je suis un grand fan du langage ge programmation Go. Dans cet article je vais essayer d'expliquer pourquoi c'est un bon choix en entreprise, quels sont ses avantages.

## Introduction

Petite remise dans le contexte. Go (Golang) est un langage de programmation compilé, développé par Google qui à maintenant 5 ans. C'est un langage qui se veut simple dans sa conception et son utilisation. Pour ceux qui ne connaissent pas, je conseille d'aller jeter un oeil à [Un tour de Go](http://go-tour-fr.appspot.com/welcome/1). C'est un didacticiel en ligne qui permet de faire le tour du langage et de découvrir ses fonctionnalités.

Venant d'un langage interprété comme PHP ça peut être un peu déroutant au début, mais sa syntaxe s'inspire du C, du C++ et du Python, donc rien de fondamentalement nouveau. La où Go innove, c'est au niveau des fonctionnalités. Globalement vous pouvez à peu près tout faire avec les **Slice**, les **Map**, les **channels** et les **Goroutines**. Vous allez me dire, mais ce langage est vide, on ne peut rien faire avec, où sont les generics ? les generator ? et j'en passe. À l'heure actuelle, on part du principe qu'un nouveau langage de programmation doit reprendre les concepts et les fonctionnalités de ces prédécesseurs. Go n'a pas choisi cette voie car ces concepteurs voulaient un langage simple par nature. Je vous laisse consulter [ce billet](http://commandcenter.blogspot.it/2012/06/less-is-exponentially-more.html) de Rob Pike, un des trois fondateurs du langage.

## Tour des fonctionnalités

Je vous ai cité précédemment les principales fonctionnalités du langage. Ce qui en fait un langage simple c'est que pour une fois, la spécification est [lisible](https://golang.org/ref/spec), tout y est bien documenté, il existe même un genre de résumé de cette spécification [ici](https://golang.org/doc/effective_go.html). Je ne vais pas m'étendre sur les Slice et les Map, en gros un Slice c'est un tableau indexé de data, et un Map permet de définir une structure de data.

Je vais rentrer un peu plus dans le détail sur les _channels_ et les _goroutines_. Une _goroutine_ est un genre de _thread_ simplifié qui permet d'écrire du code asynchrone très rapidement. le simple fait de placer le mot-clé `go` devant un appel de fonction ou une fonction anonyme crée une _goroutine_.

{% highlight go %}
go list.Sort()  // run list.Sort concurrently; don't wait for it.
{% endhighlight %}

Alors tout ça c'est bien gentil, mais comment on récupère le traitement d'une _goroutine_ ? Comment sait-on que son exécution est terminée ? C'est là qu'entre en jeu les _channels_. Un _channel_ permet de communiquer avec des _goroutines_.

{% highlight go %}
c := make(chan int)  // Allocate a _channel.
// Start the sort in a goroutine; when it completes, signal on the _channel.
go func() {
    list.Sort()
    c <- 1  // Send a signal; value does not matter.
}()
doSomethingForAWhile()
<-c   // Wait for sort to finish; discard sent value.
{% endhighlight %}

Dans cet exemple, on crée un _channel_ d'`int`, on crée une _goroutine_ dans laquelle on va procéder au tri de notre `list`, à la fin de ce tri on informe le _channel_ que le tri est terminé en envoyant un signal, dans cet exemple, la valeur du signal n'a pas d'importance. Pendant ce temps on a appelé la fonction `doSomethingForAWhile` qui va réaliser un traitement assez long. et la dernière ligne indique qu'on attend de recevoir le signal pour passer à la suite. De cette façon on est prévenu de la fin de l'exécution de notre _goroutine_.

Ces deux fonctionnalités permettent d'écrire des programmes complexes, avec des traitements asynchrones tout en restant simple dans l'écriture.

## Avantages

Le premier avantage de Go, particulièrement en entreprise, quand on travaille en équipe c'est la convention de codage. Elle est écrite dans le compilateur, ce qui fait qu'un programme qui ne respecte pas cette convention ne fonctionnera pas. Le langage met à disposition plusieurs outils pour formater son code correctement comme `go fmt` qui est inclus et [golint](https://github.com/golang/lint) qui propose des suggestions d'amélioration ainsi que `go vet` qui inspecte les constructeurs. Comme ça pas de discussion sans fin pour savoir si on met son accolade en fin de ligne ou sur la ligne suivante.

L'autre avantage est que pratiquement tout est intégrer dans la bibliothèque de base. Besoin de faire un serveur web ? `net/http` à la rescousse. Besoin de toucher à l'_I/O_ ? `io` et `io/ioutil` sont la. Pour travailler avec les fichiers ? `os` est la pour vous servir. Vous faites une API en `JSON` ? `encoding/json` est là. Bref vous l'aurez compris, tout est déjà inclus. Mais ça ne vous empêche pas d'utiliser des bibliothèques d'autres développeurs.

On en vient donc à la gestion de dépendances. Avec Go, pas de `composer.json`, pas de `Gemfile`, pas de `requirements.txt`. Les dépendances dont on a besoin se déclarent dans le fichier qui les utilise, et le compilateur râle s'il y a des dépendances qui ne sont pas utilisés.

{% highlight go %}
package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}
{% endhighlight %}

Alors vous allez dire, comment on spécifie la version d'une dépendance pour être sûr que notre programme sera compilé avec les mêmes _vendors_ sur notre machine, sur notre CI et sur notre _prod_ ? Il existe plusieurs solutions pour ça comme [gopkg.in](http://labix.org/gopkg.in) qui sert d'alias dans les imports en spécifiant une version :

{% highlight go %}
import "gopkg.in/yaml.v1"
{% endhighlight %}

Il existe aussi [godep](https://github.com/tools/godep) qui permet de sauvegarder son workspace local de dépendances, qui sera à ajouter dans sons _VCS_.

La plupart du temps, il suffit d'utiliser la technique de base de de déclarer ses dépendances dans le block `import` car un programme en Go ne doit pas casser la compatibilité. Si c'est le cas, il faut dans ce cas faire un nouveau projet. On évite ainsi avec le [Dependency hell](http://en.wikipedia.org/wiki/Dependency_hell).

Un autre avantage de Go est que celui-ci est compilé en un binaire statique. Ainsi, un simple `scp` puis un _restart_ permet de déployer une nouvelle version de son programme. Go à été pensé par ses créateurs pour des gros code source, des gros projets avec des grosses équipes qui travaillent dessus. Alors oui, un _Hello world_ en Go génère un binaire plus gros que la même chose en C ou C++. Mais c'est un langage conçu avec son temps. On à des teraoctets de stockage et des gigaoctets de mémoire vive à l'heure actuelle sur nos machines de production, donc pas besoin d'avoir un binaire qui fait _18Ko_ au lieu de _3Mo_. Pas de _Makefile_ non plus pour compiler son programme, un simple `go build` suffit.

## Inconvénients

Comment ça des inconvénients ?

## Preuve par l'exemple

Il y a maintenant des dizaines d'entreprise qui ont fait le choix de Golang, alors pourquoi pas vous ?

* [facebook](https://github.com/facebookgo)
* [Disqus](http://highscalability.com/blog/2014/5/7/update-on-disqus-its-still-about-realtime-but-go-demolishes.html)
* [Bowery](http://bowery.io/posts/Nodejs-to-Golang-Bowery/)
* [Sendgrid](https://sendgrid.com/blog/convince-company-go-golang/)
* [Iron.io](http://blog.iron.io/2013/03/how-we-went-from-30-servers-to-2-go.html)
* [Bitly](http://word.bitly.com/post/33232969144/nsq)

Je ne vais pas faire une liste exhaustive ici de toutes les entreprises qui ont fais le paris de Go, mais le simple fait de lire ces articles permet d'avoir un bon aperçu de pourquoi c'est une bonne décision.

J'ai moi même eu l'occasion de faire un peu de Go en entreprise. Chex mon [ancien employeur](https://www.wanadev.fr/), je travaillais sur un réseau social qui traitait beaucoup d'images dans beaucoup de formats. J'ai développé un worker en Go qui permet de générer les miniatures de façon asynchrone sans surcharger les requêtes HTTP, tout en profitant de toutes les capacités d'un serveur dédié à ce process.

Pour [mon employeur actuel](http://www.xotelia.com/) j'ai développé un petit programme qui permet de faire du debug sur des requêtes HTTP sans pourrir la réponse. Quand c'est de l'AJAX et qu'on renvoie du `JSON`, pas facile de faire un `var_dump` au milieu de tout ça. Il s'agit d'un petit programme connecté à Redis, qui possède un seul point d'entrée sur son API pour envoyer les messages, et il suffit d'ouvrir une page web sur l'index pour avoir le flux en temps réel (Websocket) des messages qu'on lui envoie. Je vous laisse regarder [ici](https://github.com/Xotelia/RemoteDebugCenter).

Je suis actuellement en train de développer un mini clone open source de _Vagrantcloud_ (désormais [Atlas](https://atlas.hashicorp.com/boxes/search)) qui permettra de gérer sois-même ses versions de box sur son propre serveur, avec du _continuous build_ des box via [packer](https://packer.io/).

## Conclusion

J'espère vous avoir donné l'envie de tester ce langage de programmation, et pourquoi pas avoir l'occasion de travailler sur un gros projet en Go dans votre entreprise.

Happy Coding!
