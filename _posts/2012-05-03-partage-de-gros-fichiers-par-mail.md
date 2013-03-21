---
layout: post
title: Partage de gros fichiers par mail
tags:
- dev
- email
- fichier
- git
- github
- gros
- partage
- php
- symfony
status: publish
type: post
published: true
meta:
  Hide SexyBookmarks: '0'
  _edit_last: '2'
  Hide OgTags: '0'
  _shorten_url_bitly: http://j.mp/Kfu6KM
  image: ''
  embed: This is the default text
  seo_follow: 'false'
  seo_noindex: 'false'
  _thumbnail_id: '366'
  dsq_thread_id: '674319963'
---
Bonjour,

Aujourd'hui je viens de publier en open-source (licence GPLv3) un petit service de partage de gros fichiers par email. La problèmatique était la suivante, comment partager par mail et de façon sécurisée des gros fichiers sachant que la plupart des fournisseurs (gmail, hotmail, etc) limitent la taille des pièces jointes. Le but était aussi de s'affranchir d'un éditeur de service qui possèderait les fichiers partagés. Avec un collègue de travail nous avons donc commencer ce projet.

Développé sur une base Symfony 2. Avec le minimum de bundles nécessaires. Le but était de rendre le service le plus léger possible et l'interface la plus simple. Le code source est disponible sur [github](https://github.com/wanadev/fiftysent "Fiftysent"). Une version commerciale viendra dans un second temps.

Bon fork!
