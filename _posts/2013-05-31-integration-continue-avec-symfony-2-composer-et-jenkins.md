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

Cette modification va permettre de créer une fase de donnée et de charger les fixtures, nécessaires à l'exécution de la suite de tests.

Désormais, lors de l'exécution de `bin/vendor/phpunit` la base do donnée de test sera supprimée, créée et les fixtures seront chargées avant d'exécuter les tests.

Ensuite il faut dire à Jenkins de récupérér composer et d'installer les vendors avant de lancer phpunit.

{% highlight xml %}
<!-- build.xml -->

<target name="composer" depends="clean" description="Download composer and install project dependancies">
     <exec executable="wget" failonerror="true">
        <arg value="-nc" />
        <arg value="http://getcomposer.org/composer.phar" />
    </exec>
    <exec executable="php">
        <arg value="composer.phar" />
        <arg value="config" />
        <arg value="--global" />
        <arg value="github-oauth.github.com" />
        <arg value="github_oauth-key" />
    </exec>
    <exec executable="php" failonerror="true">
        <arg value="composer.phar" />
        <arg value="install" />
        <arg value="--dev" />
        <arg value="--prefer-dist" />
        <arg value="--no-progress" />
        <arg value="--no-interaction" />
        <arg value="--no-scripts" />
    </exec>
</target>
<target name="phpunit" description="Execute tests">
    <exec executable="${basedir}/vendor/bin/phpunit" failonerror="true">
        <arg value="-c" />
        <arg path="${basedir}/app" />
    </exec>
</target>
{% endhighlight %}

Le paramètre `github-oauth.github.com` sert a passer sa clé oauth à composer pour éviter les problèmes de _fair-use_ avec l'api github.

Cette tâche ant va donc dire jenkins de télécharger composer, de configurer la clé oauth github et ensuite de lancer l'installation des vendors en utilisant `--prefer-dist` qui permet de récupérer en priorité les archives plutôt qu'un git clone. L'exécution des scripts est la aussi inutiles car tout les scripts nécessaires sont lancés par le bootstrap de test.

La deuxième tâche sert a lancer phpunit avec le fichier de config situé dans `app/`.

En configurant Jenkins au post-receive git, l'exécution des tests sera faite à chaque git push. Pour finir il suffit d'activer les rapports nécessaires jenkins pour avoir des statistiques sur son dashboard projet.

J'espère que ça vous sera utile. Bonne journée.