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

Ce matin je faisais un peu de R&amp;D au bureau pour savoir comment récupérer des mails d'un compte et sauvegarder les pièces jointes et les traiter plus tard. Après un peu de recherche sur google et twitter, je suis d'abord tombé sur [IMAP](http://fr.php.net/manual/fr/book.imap.php "IMAP"). Et un peu après sur une classe publiée sur le site [phpclasses](http://www.phpclasses.org/package/2964-PHP-Retrieve-attachments-from-messages-in-a-mailbox.html "PHPClasses"). La classe marche plutôt pas mal, sauf quelques petits problèmes. Tout d'abord les fichiers utilisent les `short_open_tag` de PHP, beaucoup de warnings sont levés si les messages traités ne contiennent pas de pièces jointes et enfin des paramètres passés à certaines fonctions sont notés comme constantes, comme par exemple le mode d'ouverture de fichier de la fonction `fopen`.

Bref, après plusieurs essais et modifications de mon côté, j'ai transformé cette classe en full objet, documentée et ajouter quelques conditions de gestion d'erreurs.

{% highlight php %}
<?php

/**
 * @author Florent Viel
 */
class MailAttachmentManager
{
  /**
   * @var string {host:port\params}BOX voir http://fr.php.net/imap_open
   */
  private $host;

  /**
   * @var string login 
   */
  private $login;

  /**
   * @var string password
   */
  private $password;

  /**
   * @var string répertoire de sauvegarde
   */
  private $saveDirPath;

  /**
   * @var object boite mail
   */
  private $mbox;

  /**
   * Constructeur
   * @param string $host {host:port\params}BOX voir http://fr.php.net/imap_open
   * @param string $login
   * @param string $password
   * @param string $saveDirPath chemin de sauvegarde des pièces jointes
   */
  public function __construct($host, $login, $password, $saveDirPath = './')
  {
    $this->host = $host;
    $this->login = $login;
    $this->password = $password;
    $this->saveDirPath = $savedirpath = substr($saveDirPath, -1) == "/" ? $saveDirPath : $saveDirPath."/";
  }

  /**
   * Décode le contenu du message
   * @param string $message message
   * @param integer $coding type de contenu
   * @return message décodé
   **/
  private function getDecodeValue($message, $coding)
  {
    switch ($coding) {
      case 0: //text
      case 1: //multipart
        $message = imap_8bit($message);
        break;
      case 2: //message
        $message = imap_binary($message);
        break;
      case 3: //application
      case 5: //image
      case 6: //video
      case 7: //other
        $message = imap_base64($message);
        break;
      case 4: //audio
        $message = imap_qprint($message);
        break;
    }

    return $message;
  }

  /**
   * Ouvrir la boîte mail
   */
  public function openMailBox()
  {
    $mbox = imap_open($this->host, $this->login, $this->password);
    if (!$mbox) {
      throw new Exception("can't connect: ".imap_last_error());
    }

    $this->mbox = $mbox;
  }

  /**
   * Ferme la boite mail en cours
   */
  public function closeMailBox()
  {
    imap_close($this->mbox);
  }

  /**
   * Récupère les parties d'un message
   * @param object $structure structure du message
   * @return object|boolean parties du message|false en cas d'erreur
   */
  public function getParts($structure)
  {
    return isset($structure->parts) ? $structure->parts : false;
  }

  /**
   * Tableau définissant la pièce jointe
   * @param object $part partie du message
   * @return object|boolean définition du message|false en cas d'erreur
   */
  public function getDParameters($part)
  {
    return $part->ifdparameters ? $part->dparameters : false;
  }

  /**
   * Récupère les pièces d'un mail donné
   * @param integer $jk numéro du mail
   * @return array type, filename, pos
   */
  public function getAttachments($jk)
  {
    $structure = imap_fetchstructure($this->mbox, $jk);
    $parts = $this->getParts($structure);
    $fpos = 2;
    $attachments = array();

    if ($parts && count($parts)) {
      for ($i = 1; $i < count($parts); $i++) {
        $part = $parts[$i];

        if ($part->ifdisposition && strtolower($part->disposition) == "attachment") {        
          $ext=$part->subtype;
          $params = $this->getDParameters($part);

          if ($params) {
            $filename = $part->dparameters[0]->value;
            $filename = imap_utf8($filename);
            $attachments[] = array('type' => $part->type, 'filename' => $filename, 'pos' => $fpos);
          }
        }
        $fpos++;
      }
    }

    return $attachments;
  }

  /**
   * Retourne la référence de l'hôte sans la boite mail
   * @return string {host:port\params} voir http://fr.php.net/imap_open
   */
  public function getRef()
  {
    preg_match('#^{[^}]*}#', $this->host, $ref);
    return $ref[0];
  }

  /**
   * Retourne la liste des boites mail associées a celle ouverte
   * @param string $pattern motif de recherche
   * @return array liste des boites mail
   */
  public function getList($pattern = '*')
  {
    return imap_list($this->mbox, $this->getRef(), $pattern);
  }

  /**
   * Récupère la contenu de la pièce jointe par rapport a sa position dans un mail donné
   * @param integer $jk numéro du mail
   * @param integer $fpos position de la pièce jointe
   * @param integer $type type de la pièce jointe
   * @return mixed data
   */
  public function getFileData($jk, $fpos, $type)
  {
    $mege = imap_fetchbody($this->mbox, $jk, $fpos);
    $data = $this->getDecodeValue($mege,$type);

    return $data;
  }

  /**
   * Sauvegarde de la pièce jointe dans le dossier défini avec un nom unique
   * @param string $filename nom du fichier
   * @param mixed $data contenu à sauvegarder
   * @return string emplacement du fichier
   **/
  public function saveAttachment($filename, $data)
  {
    $filepath = $this->saveDirPath.$filename;
    $tmp = explode('.', $filename);
    $ext = array_pop($tmp);
    $filename = implode('.', $tmp);
    $i=1;

    while (file_exists($filepath)) {
      $filepath = $this->saveDirPath.$filename.$i.'.'.$ext;
      $i++;
    }

    $fp = fopen($filepath, 'w');
    fputs($fp, $data);
    fclose($fp);

    return $filepath;
  }

  /**
   * Tag un message avec le flag delete
   * @param integer $jk numéro du message
   **/
  public function tagDeleteMessage($jk)
  {
    imap_delete($this->mbox, $jk);
  }

  /**
   * Supprime les messages tagués avec le flag delete
   **/
  public function deleteTaggedMessages()
  {
    imap_expunge($this->mbox);
  }

  /**
   * Retourne la boite mail
   * @return object boite mail
   */
  public function getMbox()
  {
    return $this->mbox;
  }

  /**
   * Retourne le destinataire du message
   * @param integer $id numéro du mail
   * @return string mail
   */
  public function getMessageTo($id)
  {
    $header = imap_fetchheader($this->mbox, $id);
    $header = imap_rfc822_parse_headers($header);
    return $header->to[0]->mailbox.'@'.$header->to[0]->host;
  }

  /**
   * Retourne l'emmetteur du message
   * @param integer $id numéro du mail
   * @return string mail
   */
  public function getMessageFrom($id)
  {
    $header = imap_fetchheader($this->mbox, $id);
    $header = imap_rfc822_parse_headers($header);
    return $header->from[0]->mailbox.'@'.$header->from[0]->host;
  }
}
{% endhighlight %}

Pour ce qui est de l'utilisation, voici une petite démo rapide d'utilisation pour parcourir sa boite mail et sauvegarder les messages dans un dossier défini :

{% highlight php %}
#!/usr/bin/env php
<?php 
require_once("attachmentread.class.php");
$host="{host:port/params}BOX"; // voir http://fr.php.net/imap_open
$login=""; //imap login
$password=""; //imap password
$savedirpath="./" ; // attachement will save in same directory where scripts run othrwise give abs path
$jk=new MailAttachmentManager($host, $login, $password, $savedirpath); // Creating instance of class####
?>
{% endhighlight %}

N'hésitez pas a commenter ou faire des suggestions par rapport au code. Prochaine étape trouver un moyen de sécuriser la boite mail qui va recevoir les pièces jointes pour les attacher à un utilisateur d'un site. Un peu comme Flickr qui permet d'ajouter des photos à son stream par mail.

Bon appétit!
