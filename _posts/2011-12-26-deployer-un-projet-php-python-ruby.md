---
layout: post
title: Déployer un projet PHP, Python, Ruby
tags:
- Dev
- php
- python
- ruby
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  Hide SexyBookmarks: '0'
  Hide OgTags: '0'
  ci_post_tutorial: ''
  ci_post_demo_link: ''
  ci_post_download_link: ''
  ci_post_level: ''
  ci_post_duration: ''
  ci_post_description: ''
  dsq_thread_id: '516619262'
  _shorten_url_bitly: http://j.mp/J3uCec
  thumb: false
---
Je me suis penché sur divers framework de développement web, notamment en python, ruby et php. J'ai pu tester Django, Ruby on Rails, Symfony et actuellement Symfony 2. L'avantage d'utiliser un framework c'est la possibilité de structurer son code, de le rendre évolutif et de laisser la possibilité à d'autres contributeurs de comprendre ce qu'on écrit. Tout ça c'est bien sympa mais ce n'est pas le but de ce billet.
<!--break-->
Le but de mon billet c'est de parler du déploiement d'un projet. Parce que le développement c'est plutôt simple. Django et Ruby on Rails proposent un built-in server, pour php il suffit de créer un virtual host dans apache et c'est parti. Bref rien de bien méchant. La où ça se complique c'est quand tu veux déployer ton projet sur un serveur de production. Il y a la solution simple qui consiste a utiliser Heroku, mais la exit le PHP. Et de plus on a pas tous les moyens de déployer un projet sur cette solution.

Donc la solution qui nous reste c'est la bonne vieille méthode, c'est à dire un serveur dédié. Pour du PHP aucun soucis, tu définis tes entrées et tes domaines sur ton DNS, tu crée ton virtual host apache qui pointe vers le dossier du projet, tu définis les accès à la base de donnée et Zou! C'est déployé. Résultat des courses entre le rsync de copie du projet sur le dédié et le moment de taper l'adresse dans la barre du navigateur ça a pris 15 minutes. Un jeu d'enfant.

La où ça se complique un peu c'est pour déployer un projet Django. La procédure est sensiblement la même, on rsync le projet dans un dossier, renseignement des DNS, définition du vhost, et oui mais la apache, de base il ne comprend pas le python. On installe donc mod_wsgi. On crée notre fichier de config.wsgi a la racine du projet pour indiquer ou se situe le settings.py et dans quel répertoire on est, on ajoute les bonnes options au vhost, redémarrage de apache et normalement quand on va voir le résultat tout s'est bien passé. Résultat des courses à peine 5 minutes de plus que pour déployer un projet PHP.

Mais voilà, arrive le dernier de la classe. Bien que ce framework soit un des plus en vogue pour les projets web a l'heure actuelle, c'est aussi pour moi un des plus complexe a déployer. Tout d'abord par sa gestion des dépendances. Parce qu'en ruby, il y a forcément une gem pour faire ce que tu as besoin de faire. Du coup tu ne te casse pas la tête a réinventer la roue, tu récupère la gem et l'inclue a ton projet. Au final tu te retrouve avec 30 gems pour un projet qui comporte 3 classe métier. Youhou. Tout ça c'est bien mais c'est pas toi qui t'occupe de maintenir et faire évoluer ces gems. Donc si tu n'as pas fait attention a bien spécifier le numéro de version de chaque gem que tu utilise. Quand tu vas déployer ton projet, certaines auront peut être été mise à jour. D'autres auront rompu la compatibilité avec des versions plus anciennes, etc. Autant de facteurs qui font de cheveux en moins sur la tête. Je peux notamment citer pour exemple Gitorious, Gitlab, Redmine, ...

Tous ces projets RoR sont extrèmement bien développé et puissant, mais quand tu veux les déployer c'est la crise de nerf assurée. Au bout d'une demi journée a résoudre des problèmes de dépendances, a te rendre compte que ton code est out dated étant donné qu'au moment de déployer tu as récupéré des versions plus récentes des gems que celles que tu as utilisé pour développer. Ben tu sens la moutarde monter au nez...

Je ne peux pas encore parler de déploiement Symfony 2 étant donné que je suis en train de l'étudier, mais son architecture se rapproche de Ruby on Rails, notamment pour la gestion des bundles, et j'ai bien peur qu'on arrive a la même aberration qu'avec ruby. Reste à savoir si les développeurs seront plus rigoureux ou non.

A bon entendeur.
