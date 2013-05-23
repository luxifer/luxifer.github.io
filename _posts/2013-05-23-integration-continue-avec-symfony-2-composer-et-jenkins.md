---
layout: post
title: "Intégration continue avec Symfony 2, Composer et Jenkins"
description: ""
category: 
tags:
- dev
- php
- xml
- github
- composer
- jenkins
meta:
  thumb: '/images/640x140/ci.png'
---
Bonjour,

Aujourd'hui on va parler d'intégration continue avec Symfony2, Composer et Jenkins.

Après plusieurs jours de galère à chercher de la doc sur comment mettre en place des tests automatisé sur symfony2 avec jenkins, j'ai finalement réussi à faire ce que je voulais.
Tout d'abord, plusieurs problèmatiques se posent. Pour les tests unitaires pas besoin de grand chose, on test juste une classe, une fonction ou une méthode. Pour les tests fonctionnels c'est différent. Il faut un environnement, une base de donnée et potentiellement un jeu de donnée.
<!--break-->
Passons donc aux choses sérieuses.

Symfony permet de créer différents environnements, typiquement `dev` et `prod`. Les besoins ne sont pas les mêmes, en dev on a besoin de debug, de sandbox, etc. En prod on a besoin de cache, etc. On va donc commencer par mettre en place en environnement pour les test et faire en sorte qu'il soit le plus petit et le plus indépendant possible.

&Agrave; la création d'un projet Symfony 2, l'environnement de test est déjà créé, il nous reste à le customiser.

{% highlight yaml %}
# app/config_test.yml

imports:
    - { resource: config_dev.yml }

framework:
    test: ~
    session:
        storage_id: session.storage.mock_file

web_profiler:
    toolbar: false
    intercept_redirects: false

swiftmailer:
    disable_delivery: true

doctrine:
    dbal:
        driver:     pdo_sqlite
        path:       %kernel.root_dir%/var/test.db
        user:       root
{% endhighlight %}

On va donc dire à symfony qu'on veut utiliser sqlite comme base de donnée car les jeux de données sont petit et qu'on a pas besoin de performance. J'ai choisi de stocker la base dans un fichier, mais il est très bien possible de la stocker en mémoire en remplaçant l'option `path` par `memory: true`.

Ensuite pour exécuter sa suite de tests, il faut un `bootstrap` pour initialiser une requête d'un test fonctionnel. La le problème c'est que le `bootstrap.php.cache` de symfony de base va seulement faire un autoload des vendors et initialiser le kernel. Avec un environnement de test il faut monter une base donnée, créer les tables et charger les fixtures. Il est possible de dire à phpunit d'utiliser un fichier de bootstrap spécifique qui va faire les choses à notre place.

{% highlight xml %}
<!-- app/phpunit.xml.dist -->

<phpunit
    bootstrap = "tests.bootstrap.php" >
{% endhighlight %}

Dans ce fichier on indique à phpunit d'utiliser un fichier spécifique pour exécuter nos tâches de bootstrap.

{% highlight php %}
<?php
// app/tests.bootstrap.php

if (isset($_ENV['BOOTSTRAP_DB_ENV'])) {
    passthru(sprintf(
        'rm "%s/var/test.db"',
        __DIR__
    ));
    passthru(sprintf(
        'php "%s/console" doctrine:schema:update --force --env=%s',
        __DIR__,
        $_ENV['BOOTSTRAP_DB_ENV']
    ));
    passthru(sprintf(
        'php "%s/console" doctrine:fixtures:load --append --env=%s',
        __DIR__,
        $_ENV['BOOTSTRAP_DB_ENV']
    ));
}

require __DIR__.'/bootstrap.php.cache';
{% endhighlight %}

Dans ce fichier on liste les tâches à exécuter si la variable d'environement `BOOTSTRAP_DB_ENV` est définie. Là on indique qu'on veut supprimer la base de test existante, créer le schéma et charger les fixtures.

Ensuite pour définir cette variable d'environnement, il faut rajouter ceci dans son fichier `phpunit.xml.dist`

{% highlight xml %}
<!-- app/phpunit.xml.dist -->

<php>
    <env name="BOOTSTRAP_DB_ENV" value="test"/>
</php>
{% endhighlight %}