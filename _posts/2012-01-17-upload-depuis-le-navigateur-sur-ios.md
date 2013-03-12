---
layout: post
title: Upload depuis le navigateur sur iOS
tags:
- android
- browser
- Dev
- images
- ios
- ipad
- iphone
- ipod
- javascript
- navigateur
- photos
- php
- pictures
- safari
- upload
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  Hide SexyBookmarks: '0'
  Hide OgTags: '0'
  dsq_thread_id: '542472107'
  image: ''
  embed: This is the default text
  seo_follow: 'false'
  seo_noindex: 'false'
  _thumbnail_id: '298'
  _shorten_url_bitly: http://j.mp/y31ljV
---
![](/images/picup-app.png)

Bonjour à tous, aujourd'hui je vais écrire un article plutôt incendiaire sur les différents choix faits par Apple concernant iOS. Je ne parlerai que d'un seul point car mon but n'est pas de créer un troll mais de partager la solution que j'ai trouvé pour pallier à ce problème.

Je ne sais pas si vous le savez, mais sur iPhone, iPod et iPad il est impossible de cliquer sur le bouton parcourir d'un formulaire sur une pag web pour joindre un fichier. Celui-ci est tout simplement grisé... On ne peut pas accéder a son arborescence de fichier depuis le navigateur safari sur iOS. Ceci est du au fait que ce système d'exploitation, chaque application possède son propre système de fichier et ne peut pas accéder au contenu d'une autre application. Je ne comprend pas le choix des développeurs Apple sur ce point là. Pourquoi brider l'expérience web mobile et de forcer à passer à des applications tierces pour pallier à ce problème.

Enfin arrêtons de "troller" mais j'ai trouvé une solution pour pouvoir contourner le bridage de Apple. Il s'agit de [Picup](http://picupapp.com/index.html). Cette application va transformer les champs `<input type="file">` en lien `fileupload://` qui va ensuite faire appel a l'appli installée sur le périphérique. Pour intégrer cette appli a son site internet il suffit d'ajouter le fichier javascript téléchargeable [ici](https://castle.so/dl/5tt6l+s) sur la page contenant le formulaire. Et ensuite il suffit d'utiliser le helper pour générer l'url à passer a l'appli pour traiter le fichier.
{% highlight javascript %}$(function() {
  Picup.convertFileInput('input',{
    'referername': escape('referer'),
    'callbackurl': escape('url de callback'),
    'postimageparam': 'file',
    'posturl': escape('url de post'),
    'postvalues': escape('paramètres additionnels a envoyer avec la requete POST'),
    'purpose': escape('texte a afficher en dessous de l application'),
    'referrerfavicon': escape('icone a afficher dans l application')
  });
});{% endhighlight %}
Ne pas oublier de faire de la détection de navigateur ajant d'ajouter ce script, car sur le navigateur natif android l'upload marche. Sur la page indiquée en callback, il peut être utile de créer une fonction de callback avec le helper picup pour faire un traitement supplémentaire sur les fichiers uploadés avec l'application.
{% highlight javascript %}Picup.callbackHandler = function(params){
  for(var key in params){
    alert(key+' == '+params[key]);
  }
}{% endhighlight %}
Pour voir le résultat il y a une démo sur le site de l'application, avec un [scratchpad](http://picupapp.com/scratchpad.html) qui permet de modifier les paramètres de la requête afin de faire les tests directement sur son serveur.

Voilà pour le côter javascript, il reste a écrire côter serveur la méthode qui va traiter la requête POST qui va être faite par picup et l'intégration est terminée. Le rendu est un bouton à la place du champ `<input type="file">` qui va ouvrir l'application et permettre à l'utilisateur de choisir une image parmis sa galerie.

Il y a quand même deux limites à cette technique, impossible de choisir plusieurs fichiers en même temps, et il est seulement possible de parcourir sa galerie. Donc impossible d'ajouter un pdf, un document ou tout autre type de fichier.

Voilà voilà ;)

Edit:

J'ai modifié le fichier javascript a inclure à son site, en utilisant le helper de la même manière, si l'application Picup n'est pas installée le visiteur est dirigé vers l'appstore.
