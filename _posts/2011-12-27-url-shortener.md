---
layout: post
title: Url Shortener
date: 2011-12-27 22:14:39
tags:
- Dev
- django
- python
- url
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
  dsq_thread_id: '518110033'
  image: ''
  embed: This is the default text
  seo_follow: 'false'
  seo_noindex: 'false'
  _shorten_url_bitly: http://j.mp/HRxGcu
---
Salut à tous,

Voulant me remettre petit à petit dans le framework django de python, je me suis dit que j'allais développer un petit projet. C'est la que j'ai eu l'idée de créer mon propre raccourciceur d'URL. Pourquoi faire me diriez vous? Tout simplement pour la performance, je sais très bien que sur le web ce n'est pas ce qui manque comme service, mais j'avais envie d'essayer.

Le code source du projet est sous licence GPL V3 et est disponible sur github : [https://github.com/LuXiFeR/UrliZr](https://github.com/LuXiFeR/UrliZr)
<!--break-->
J'ai commencé par simplement faire un générateur d'identifiant unique en python :
{% highlight python %}
import string
from random import choice

def genUid():
  chars = string.letters + string.digits
  return u''.join(choice(chars) for i in range(8))
{% endhighlight %}
Cette fonction me permet de générer un ID unique pour chaque URL de 8 caractères de long, ce qui me permet de stocker un paquet d'adresses en base de données.

J'ai ensuite fait une petite interface web un peu stylisée pour pouvoir générer les URL raccourcis.

Peu de temps après, je me suis dit que ça serait sympa de savoir combien de fois on click sur les liens raccourcis que je partage, j'ai donc ajouté un petit compteur. Seulement voilà, problème. J'ai bien le nombre de fois que le lien est visité, mais la visite des robots qui parcourent le web ne m'intéresse pas. J'ai donc fait une page intermédiaire contenant du code javascript pour google analytics ou tout autre plateforme de statistiques afin de prendre en compte seulement les visiteurs qui exécutent du javascript. C'est à dire potentiellement aucun bots. Bien que certains commencent a être écrit en node.js, et donc exécution de javascript côté serveur.

J'ai maintenant accès aux statistiques des visiteurs qui suivent mes liens. Il faudrait pouvoir rajouter les hashtags et mot clés associés afin de mieux déterminer le profil mais c'est un bon début.

Ensuite je me suis dit, c'est bien tout ça mais je suis obligé de passé par la page web pour raccourcir mes URL. J'ai donc décider de créer une API REST en POST pour générer mes URL depuis n'importe ou. Pour ça il suffit d'envoyer le paramètre `url=http://domain.tld/params` a l'adresse suivante : `http://url.luxifer.fr/api/translate/method` ou `method` peut être raw, json ou xml. C'est à dire comment va être formaté le résultat.
