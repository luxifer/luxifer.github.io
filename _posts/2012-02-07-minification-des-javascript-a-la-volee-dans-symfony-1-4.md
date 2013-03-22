---
layout: post
title: Minification des javascript a la volée dans symfony 1.4
tags:
- compilation
- compression
- Dev
- javascript
- minification
- optimisation
- performance
- php
- serveur
- symfony
- web
status: publish
type: post
published: true
meta:
  thumb: '/images/2378867408_5d2ac25d2f_o-519x140.jpg'
  dsq_thread_id: '567526946'
---
Salut à tous! Ajourd'hui on va parler webperf et notamment temps de chargement des pages. Quand on développe en javascript on utilise souvent jQuery comme framework qui assure la compatibilité de son application sur presque tous les navigateurs. Qui simplifie certains fonctionnement, etc. Et souvent quand on utilise ce framework on ne prend pas la peine de redévelopper l'existant, on va chercher un plugin. Et forcément au final on se retrouve avec l'inclusion de 15 javascripts par page ce qui ralenti considérablement le temps de chargement. Je fais la passe sur la configuration du serveur web, on va considéré que de ce côté là la durée d'expiration est précisée, la compression activée, etc. Reste que même si la requête est faite sur le cache du navigateur, ça fait quand même une requête.

Deuxième point, la plupart du temps les plugins fournis ne sont pas minifiés, c'est à dire que le code est lisible et compréhensible. Une minification simple consiste a raccourcir les noms de variable et supprimer les espaces blancs et sauts de ligne. De ce fait on peu avoir un gain non négligeable sur la taille du javascript.

Le problème qui se pose c'est le passage en production du site. Quelles sont les posibilités  avec symfony 1.4 pour minifier et compresser les javascripts de façon automatique ? Le plus simple serait de passer par un service ou un programme et de minifier à la main chaque javascript avant de déployer. Pour peu que les mises en production soient régulières, ce processus devient vite barbant. Le fait est aussi qu'il y aura toujours autant de requêtes de faites pour récupérer les javascripts au chargement de la page. Et le plus long n'est pas le téléchargement de la ressource mais l'attente de la réponse du serveur. Je me suis donc sit qu'il fallait minifier et commpresser tous les javascripts dans un seul fichier. Le problème c'est que pour un gros site, suivant les pages, il n'y aura pas les mêmes javascripts d'appelés. Et donc comment faire pour parcourir toutes les pages différentes du site de façon automatique ? Le plus simple c'est de laisser cette tâche à l'utilisateur. Comprenez au premier affichage d'une page on va lancer une tâche de minification des javascripts et mettre un fallback avec les javascripts non minifiés pour que le site fonctionne toujours correctement. Une fois cette tâche terminée le prochain affichage de cette même page va appeler l'unique javascript minifié.

La se pose plusieurs problèmes. Comment savoir qu'une page ne contient pas les mêmes javascripts qu'une autre ? On va calculer un hash MD5 de tous les javascripts de la page qui est demandée, lancer le processus et stocker le résultat avec comme nom de fichier le hash calculé précédemment.

Deuxième problème, comment savoir qu'il n'y a pas déjà une tâche de lancée ? Il y a plusieurs possibilités, mais après avoir essayé `flock() `ou d'autres technique plutôt propres, je n'ai pas eu d'autres choix que de faire mon propre système de lock. C'est à dire, au lancement de la tâche, je vérifie que le fichier de lock avec le hash n'existe pas, s'il n'est pas présent je le crée et je commence la tâche de minification. Sinon le processus se termine. Avec cette technique on est sûr qu'un seul processus va essayer d'ouvrir le fichier pour y stocker le résultat de la minification. Si le site a pas mal de visite, la génération de tous les javascripts devrait se faire assez vite pour les différentes pages.

Le dernier point à aborder, c'est la mise a jour de ces javascripts minifiés. Si on modifie un javascript, au prochain déploiement vu que les javascripts minifiés existent déjà, il ne sera pas pris en compte. Il suppit juste de passer une petite tâche des javascripts minifiés à chaque déploiement et c'est réglé.

Pour le code, voici les différents fichier :
Tout d'abord le `AssetHelper.php`

{% highlight php %}
<?php 
function get_javascripts()
{
  $response = sfContext::getInstance()->getResponse();
  $host = sfContext::getInstance()->getRequest()->getHost();
  sfConfig::set('symfony.asset.javascripts_included', true);

  $params = '';
  $absolute = array();
  $html = '';
  $fallback = '';
  foreach ($response->getJavascripts() as $file => $options)
  {
    $absolute[] = javascript_path($file, false);
    $params .= '&code_url=http://'.$host.javascript_path($file, false);
    $fallback .= javascript_include_tag($file, $options);
  }
  sort($absolute);
  $absolute = http_build_query($absolute);
  $md5 = md5($absolute);
  $path = '/uploads/min.'.$md5.'.js';
  $generate = file_exists(getcwd().$path) ? false : true;

  if ($generate) {
    $param_array = array(
      'output_format' => 'json',
      'compilation_level' => 'SIMPLE_OPTIMIZATIONS',
      'output_info' => 'compiled_code'
    );
    $params = http_build_query($param_array).$params;
    $exec = '/usr/bin/php -f '.getcwd().'/../lib/genMinifiedJs.php "'.$params.'" "'.getcwd().$path.'" 2&> /dev/null &';
    popen($exec, 'r');
    $html = $fallback;
  }
  else {
    $html = javascript_include_tag($path, $options).$html;
  }

  return $html;
}
?>
{% endhighlight %}

Ensuite la tâche de minification `genMinifiedJs.php` à placer à la racine du répertoire lib du projet symfony

{% highlight php %}
#!/usr/bin/env php
<?php

if ($argc) {
  $params = $argv[1];
  $path = $argv[2];

  if (!file_exists($path.'.lock')) {
    touch($path.'.lock'); //Création d'un fichier de lock pour empecher toute autre instance de travailler en meme temps

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://closure-compiler.appspot.com/compile');
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $retour = curl_exec($ch);
    curl_close($ch);

    $retour = json_decode($retour, true);

    if (array_key_exists('compiledCode', $retour) && !empty($retour['compiledCode'])) { //Vérification du retour de google closure compiler
      $fp = fopen($path, 'a');
      fwrite($fp, $retour['compiledCode']);
      fclose($fp);
    }
    else {
      unlink($path.'.lock'); //Suppression du fichier de lock en cas d'échec de compilation pour autoriser une nouvelle génération
    }
  }
  else {
    die; //Une instance existe déja, on quitte le navire
  }
}
?>
{% endhighlight %}

Et voilà, maintenant, à chaque page un seule javascript sera chargé et une fois qu'il sera mis en cache par le navigateur, le temps de chargement du site sera bien réduit.

Dernier point technique, j'ai utilisé l'API REST [Google Closure Compiler](http://code.google.com/closure/compiler/) pour minifier mes javascripts. Je vous laisse voir la [documentation](http://code.google.com/closure/compiler/docs/api-ref.html) pour modifier les paramètres a envoyer. Il y a aussi la possibilité de télécharger le compiler en java et d'utiliser celui-ci pour la génération, mais pour des questions techniques et pour alléger le serveur je préfère faire une requête externe plutôt que de charger du java...

Faites en bon usage !!
