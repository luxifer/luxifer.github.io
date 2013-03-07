---
layout: post
title: Récupérer les pièces jointes d'un mail en PHP via IMAP
tags:
- attachment
- code
- Dev
- email
- imap
- mail
- php
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
  dsq_thread_id: '527590055'
  _wp_old_slug: reuperer-les-pieces-jointes-dun-mail-en-php-via-imap
  _thumbnail_id: '259'
  _shorten_url_bitly: http://j.mp/x863rZ
---
Bonjour à tous!

Ce matin je faisais un peu de R&amp;D au bureau pour savoir comment récupérer des mails d'un compte et sauvegarder les pièces jointes et les traiter plus tard. Après un peu de recherche sur google et twitter, je suis d'abord tombé sur <a title="IMAP" href="http://fr.php.net/manual/fr/book.imap.php">IMAP</a>. Et un peu après sur une classe publiée sur le site <a title="PHPClasses" href="http://www.phpclasses.org/package/2964-PHP-Retrieve-attachments-from-messages-in-a-mailbox.html">phpclasses</a>. La classe marche plutôt pas mal, sauf quelques petits problèmes. Tout d'abord les fichiers utilisent les `short_open_tag` de PHP, beaucoup de warnings sont levés si les messages traités ne contiennent pas de pièces jointes et enfin des paramètres passés à certaines fonctions sont notés comme constantes, comme par exemple le mode d'ouverture de fichier de la fonction `fopen`.

Bref, après plusieurs essais et modifications de mon côté, j'ai transformé cette classe en full objet, documentée et ajouter quelques conditions de gestion d'erreurs.

[https://gist.github.com/3235487](https://gist.github.com/3235487)

Pour ce qui est de l'utilisation, voici une petite démo rapide d'utilisation pour parcourir sa boite mail et sauvegarder les messages dans un dossier défini :

[https://gist.github.com/3235580](https://gist.github.com/3235580)

N'hésitez pas a commenter ou faire des suggestions par rapport au code. Prochaine étape trouver un moyen de sécuriser la boite mail qui va recevoir les pièces jointes pour les attacher à un utilisateur d'un site. Un peu comme Flickr qui permet d'ajouter des photos à son stream par mail.

Bon appétit!
