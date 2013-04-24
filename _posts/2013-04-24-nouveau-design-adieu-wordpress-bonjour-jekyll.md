---
layout: post
title: "Nouveau design, adieu Wordpress, bonjour Jekyll"
description: ""
category: 
tags: 
- dev
- php
- ruby
- github
status: publish
type: post
published: true
meta:
  thumb: '/images/640x140/jekyll.png'
---
Bonjour,

Cela faisait un moment que je n'avais pas posté, et bien c'est chose faite. Je vous présente donc mon nouveau design dérivé du bootstrap twitter.
Aussi j'en ai profité pour me passer de wordpress et ainsi tester un générateur de site statique. Je m'explique. Il s'agit d'un programme qui prend en entrée une liste de posts et qui va générer toute l'arborescence nécessaire. On se passe donc d'une étape (l'exécution php).

J'ai choisi `Jekyll` arbitrairement en ayant parcouru github, même si c'est en ruby j'ai trouvé que c'était la meilleure solution car beaucoup de développeurs l'utilise.
Le seul problème que j'ai c'est pour la coloration syntaxique, jekyll utilise `pygments.rb` qui lui-même fais appel à pygments en python. Sur archlinux la version par défaut de python est python3 alors que pygments.rb est basé sur la version python2 de pygments. J'ai donc juste eu besoin de faire un virtualenv afin de générer mon site.

Concernant mon absence ces derniers temps, je suis Papa d'un petit garçon de 4 mois et donc mes journées sont bien occupées.
Je vais essayer d'écrire un peu plus sur ce blog, autant concernant le technique que sur ma vie personnelle.

Bonne journée.