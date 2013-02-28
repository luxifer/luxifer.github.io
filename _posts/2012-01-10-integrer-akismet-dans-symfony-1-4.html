---
layout: post
title: Intégrer Akismet dans Symfony 1.4
tags:
- akismet
- Dev
- php
- spam
- symfony
status: publish
type: post
published: true
meta:
  image: ''
  Hide OgTags: '0'
  Hide SexyBookmarks: '0'
  _edit_last: '2'
  embed: This is the default text
  seo_follow: 'false'
  seo_noindex: 'false'
  dsq_thread_id: '533738901'
  _shorten_url_bitly: http://j.mp/I78VU6
---
Bonjour à tous!

Aujourd'hui je vais parler de l'intégration de Akismet dans Symfony 1.4 afin de réduire le spam sur ses commentaires. Si vous avez un blog wordpress vous devez sûrement savoir ce qu'est Akismet, sinon je vous invite à visiter le site officiel <a href="http://akismet.com/">ici</a>.

Tout d'abord, il va falloir créer un compte pour récupérer une clé d'API. Pour le développement j'ai choisi le plan "Personal" à 0€, mais si votre site fait du profit ou si vous faites la promotion d'un produit dessus vous devrez souscrire à une offre payante.

Une fois votre compte créé, vous recevez un mail avec votre clé API et vos informations personnelles. Conservez bien cette clé. Maintenant, on va passer à l'intégration dans symfony. C'est assez simple, vu qu'il y a déjà un plugin de disponible à cette <a href="http://plugins.symfony-project.org/get/drAkismetPlugin/drAkismetPlugin-0.3.3.tgz">adresse</a>. Donc je vous laisse télécharger le plugin et l'extraire dans le répertoire<em> plugins/</em> de votre projet symfony. Et ensuite bien renommer le dossier du plugin en "drAkismetPlugin".

On va d'abord commencer par la configuration, donc ouvrez le fichier <em>akismet.yml.example</em> dans le sous-répertoire <em>config/</em> du plugin et enregistrez le en <em>akismet.yml</em>.

<pre lang="yaml">
akismet:
  user_agent:
    application:
      name: drAkismetPlugin
      version: 0.3.2
    plugin:
      name: Akismet
      version: 1.1

  api_keys:
    www.example.com: ############
    localhost: #host utilisé pour le dev
      host: www.example.com
      key: ############
</pre>
Maintenant le plugin configuré, il faut activé le plugin dans le fichier <em>config/projectConfiguration.class.php</em>.

<pre lang="php">
$this->enablePlugins('drAkismetPlugin');
</pre>

Maintenant que le plugin est activé et disponible, il faut se poser la question de comment on va l'intégrer à notre application. Pour ça il y a plusieurs possibilité, la plus simple c'est d'utiliser le <em>sfValidator</em> fourni avec le plugin. Il y a d'autres possibilité, mais je vais décrire l'intégration avec le validateur. Nous verrons les autres pour signaler à Akismet un Spam ou un Ham dans l'administration.

Donc pour utiliser le validateur, rien de plus simple, il s'utilise comme un validateur symfony classique. Ouvrez le <em>form</em> de votre projet et allez dans la méthode <em>configure()</em>.

<pre lang="php">
$this->validatorSchema['text'] = new sfValidatorAnd(array( //text est le contenu du commentaire, adaptez à votre modèle
  $this->validatorSchema['text'],
  new drAkismetValidatorSpam(array(
    'blog' => 'http://www.example.com',
    'user_ip' => $_SERVER['REMOTE_ADDR'],
    'referrer' => (array_key_exists('HTTP_REFERER', $_SERVER) ? sfContext::getInstance()->getRequest()->getReferer() : sfContext::getInstance()->getRequest()->getUri()),
    'comment_author' => 'John Doe', //Nom de l'auteur du commentaire
    'comment_author_email' => 'john.doe@example.com', //Email de l'auteur du commentaire
    'comment_content' => $this->getValue('text')
  ))
));
</pre>

Et voilà, maintenant dès que vous posterez un commentaire, si Akismet le déclare comme spam, le formulaire ne sera pas valide et le commentaire ne sera pas sauvegardé.

Maintenant on peut se dire qu'on a besoin de faire un peu plus que ne pas sauvegarder le commentaire. C'est possible, on peut écouter la requête avant qu'elle soit envoyée à Akismet et récupérer la réponse avant qu'elle ne soit traitée par le validateur. Pour ça j'ai du faire une petite modification du plugin pour qu'il récupère le dispatcher d'événement de l'application au lieux d'en créer un nouveau. Ouvrez le fichier <em>lib/api/connection/drAkismetApiSocketConnection.class.php</em> et remplacez le contenu du constructeur pa ça :

<pre lang="php">
$this->_dispatcher = sfContext::getInstance()->getEventDispatcher();
</pre>

Donc maintenant le dispatcher est connecté à symfony, il faut ensuite récupérer l'événement pour indiquer quelle méthode va l'écouter :

<pre lang="php">
$this->dispatcher->connect('akismet.pre_request', array('listenToPreRequest'));
$this->dispatcher->connect('akismet.raw_response', array('listenToRawResponse'));
</pre>

Maintenant qu'on écoute les événements et qu'on a défini les méthodes qui vont les traiter voici quelques méthodes utiles pour <em>parser</em> la réponser qu renvoit le serveur.

<pre lang="php">
public static function listenToRawResponse(sfEvent $event)
{
  $rawResponse = new drAkismetApiResponse($event['response']);
}
</pre>

Voilà voilà, à votre tour d'intégrer Akismet à votre projet Symfony. Si vous avez des retours, n'hésitez pas à utiliser les commentaires.
