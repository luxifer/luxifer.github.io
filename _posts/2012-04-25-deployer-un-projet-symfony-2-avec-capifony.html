---
layout: post
title: Déployer un projet Symfony 2 avec Capifony
tags:
- capifony
- capistrano
- déploiement
- déploy
- déployer
- Dev
- gem
- git
- Linux
- php
- ruby
- scm
- symfony
- web
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  Hide SexyBookmarks: '0'
  Hide OgTags: '0'
  image: ''
  embed: This is the default text
  seo_follow: 'false'
  seo_noindex: 'false'
  _shorten_url_bitly: http://j.mp/I94R8Q
  dsq_thread_id: '663485541'
  _thumbnail_id: '361'
---
Bonjour à tous!

Aujourd'hui j'ai voulu tester <a href="http://capifony.org/" target="_blank">capifony</a>. C'est un petit programme basé sur <a href="https://github.com/capistrano/capistrano" target="_blank">capistrano</a> qui permet de déployer facilement un projet symfony 1.4 ou 2 sur un serveur de production. Ce programme permet de gérer les releases de votre projet, de faire des rollback, de revenir sur unr version anciennement déployée, etc. Il est écrit en ruby par un développeur de l'agence web <a href="http://knplabs.fr/" target="_blank">KnpLabs</a>.

Tout d'abord il faut installer la gem ruby :

{% highlight bash %}
gem install ruby
{% endhighlight %}

Ensuite il faut se rendre dans le répertoire de son projet pour initialiser capifony.

{% highlight bash %}
export PATH=$PATH:~/.gem/ruby/version/bin
cd /path/of/project
capifony .
{% endhighlight %}

Cette commande va créer un fichier <em>Capfile</em> à la racine de votre projet et un fichier <em>deploy.rb</em> dans le dossier <em>app/config/</em>, ou dans le dossier <em>config/</em> pour un projet symfony 1.4.

Ensuite il faut configurer le fichier deploy.rb afin de spécifier tous les paramètres nécessaires au déploiement.

{% highlight ruby %}
set :domain, "" # adresse du serveur de production
set :deploy_to, "" # répertoire ou déployer
set :app_path, "app"

set :repository, "" # adresse du scm
set :scm, :git
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `subversion`, `mercurial`, `perforce`, `subversion` or `none`
set :deploy_via, :copy

set :model_manager, "doctrine"
# Or: `propel`

role :web, domain # Your HTTP server, Apache/etc
role :app, domain # This may be the same as your `Web` server
role :db, domain, :primary => true # This is where Rails migrations will run

set :use_sudo, false
set :use_composer, false
set :keep_releases, 3
{% endhighlight %}

Il est possible de définit une option en plus si l'utilisateur sur le serveur de production est différent de celui de la machine locale :

{% highlight ruby %}
set :user, "" # utilisateur distant
{% endhighlight %}

Pour un projet Symfony 2 il peut être utile d'ajouter ces options la, pour partager le dossier <em>vendors/</em> et <em>logs/</em>  entre toutes les releases et le fichier <em>parameters.ini</em>.

{% highlight ruby %}
set :shared_files,      ["app/config/parameters.ini"]
set :shared_children,     [app_path + "/logs", web_path + "/uploads", "vendor"]
set :update_vendors, true
{% endhighlight %}

Si votre projet utilise Composer comme gestionnaire de dépendances il faut aussi rajouter cette option :

{% highlight ruby %}
set :use_composer, true
{% endhighlight %}

Une fois ce fichier modifié, il faut initialiser la structure des dossiers sur le serveur de production en tapant cette commande :

{% highlight bash %}
cap deploy:setup
{% endhighlight %}

Il faut maintenant configurer sur le serveur de production le fichier <em>parameters.ini</em> :

{% highlight bash %}
ssh production_server
cd /path/to/project/shared
mkdir -p app/config
vim app/config/parameters.ini
{% endhighlight %}

Et une fois toutes ces étapes finies avec succès, il suffit juste de lancer la commande :

{% highlight bash %}
cap deploy
{% endhighlight %}

Cette commande va créer un nouveau dossier dans <em>/path/to/project/releases</em> et faire pointer le dossier <em>current/</em> vers cette dernière release. Ensuite installer les vendors si c'est un projet Symfony 2, publier les assets, vider le cache et lancer tous les hooks lié au scm.

Une fois les projet déployé, il suffit juste de faire pointer son domaine vers le dossier <em>current/</em> du projet.
Pour les autres commandes disponibles je vous laisse vous référer à la page de <a href="http://capifony.org/" target="_blank">capifony</a>.

Bon déploiement !
