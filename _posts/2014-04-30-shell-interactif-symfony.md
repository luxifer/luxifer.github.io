---
layout: post
title: "Shell interactif Symfony2"
description: ""
category:
tags:
  - Dev
  - php
  - symfony
  - shell
  - repl
status: publish
type: post
published: true
meta:
  thumb: 'psysh.png'
---
En python avec le framework django ou en ruby avec rails on dispose d'un shell interactif qui permet de jouer avec ses modèles, la base de donnée, etc. Cette possibilité manquant dans Symfony2. C'est pourquoi j'ai développé une petite lib basée sur [psysh](http://psysh.org/) qui permet d'avoir un shell interactif php avec l'application bootée dedans.
<!--break-->
Le projet est disponible [ici](https://github.com/luxifer/symfony-repl). L'installastion est simple :

{% highlight bash %}
composer require-dev luxifer/symfony-repl
{% endhighlight %}

Ou en le rajoutant à la main dans son `composer.json` et en lançant un `composer update` :

{% highlight json %}
{
    "require-dev": {
        "luxifer/symfony-repl": "dev-master"
    }
}
{% endhighlight %}

Ensuite à la racine de son projet Symfony, il suffit de lancer `bin/symfony-repl` et le shell se lance.

{% highlight bash %}
Psy Shell v0.1.8 (PHP 5.5.11 — cli) by Justin Hileman
>>>
{% endhighlight %}

Depuis ce shell on a la variable `$kernel` qui est exposée et qui est le kernel Symfony. Depuis ce shell on peut lancer `$kernel->getContainer()` pour accéder au conteneur de service symfony et donc ainsi accéder à tous les services définis. Tout le code qu'on a écrit dans le dossier `src/` est disponible et on peut donc facilement instancier un modèle comme `Acme\UserBundle\Entity\User`.

Cette petite lib va instancier un kernel Symfony avec l'environnement de `dev`, c'est une sorte de _proof of concept_, par la suite je vais rajouter des fonctionnalité pour changer l'environnement ou même le fichier de bootstrap de Symfony.

Happy development!
