---
layout: post
title: ArchLinux sur un Dell XPS 15z
tags:
- 15z
- archlinux
- dell
- install
- Linux
- linux
- nvidia
- optimus
- xps
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _lacands_meta_show: '1'
  ci_post_tutorial: ''
  ci_post_demo_link: ''
  ci_post_download_link: ''
  ci_post_level: ''
  ci_post_duration: ''
  ci_post_description: ''
  Hide SexyBookmarks: '0'
  Hide OgTags: '0'
  dsq_thread_id: '517529089'
  image: ''
  embed: This is the default text
  seo_follow: 'false'
  seo_noindex: 'false'
  _shorten_url_bitly: http://j.mp/IZX8xm
---
Salut à tous ;)

Début Juillet j'ai commandé un Dell XPS 15z. Ça y est, je l'ai reçu, après un mois d'attente. Et je ne suis pas déçu. L'écran est magnifique avec une résolution 1920x1080. La finition est tip top. Bref, bien content.

Voilà, c'est bien, j'ai fait joujou avec mon nouveau laptop, mais voilà, c'est bien gentil tout ça, mais on fait pas grand chose avec Windows.
Donc vient l'étape cruciale de la mise en route : l'installation de Linux sur du matériel tout neuf avec la nouvelle techno Nvidia Optimus.

Et bien croyez moi, c'est pas une mince affaire.

Tout d'abord, lancer gparted depuis une clé USB afin de configurer les partitions. Et la j'étais assez bluffé, mais avec la dernière iso release de gparted, je boot sur le bureau, avec la résolution native du laptop. Pas mal. Bon seul petit soucis, le touchpad n'est pas reconnu.

Après quelques fouilles sur internet, je découvre la solution miracle : il faut modifier le protocole utilisé par le module de gestion de la souris.

`# rmmode psmouse && modprobe psmouse proto=imps`

Magique, le touchpad marche. On peut donc passer à la création des partitions. C'est là qu'on a une deuxième surprise, il y a déjà 3 partitions primaires prises pour Windows 7.  Une pour le recovery, une de récupération et la 3ème qui contient windows. Eh ben le seule solution c'est de créer une partition étendue, et ensuite de créer ses partitions logiques à l'intérieur.

30 minutes plus tard et les partitions créées. Passons à l'installation proprement dite.

Alors la on se dit qu'on va récupérer la dernière release sur le site de http://www.archlinux.org/download/
Donc on récupère l'image de la netinstall et on lance un petit

`# dd if=/chemin/de/l/iso.iso of=/dev/sdx`

Donc tout va bien on branche la clé USB sur le laptop, on boot dessus et on arrive sur le shell root. Pour commencer on est français alors :

`# loadkeys fr`

Ca nous évitera certaines prises de tête à chercher ou se trouve tel caractère sur un clavier QWERTY alorsqu'on a un clavier AZERTY. Ensuite on lance le script d'installation de Archlinux :

`# /arch/setup`

Et là ou se retrouve avec quelque-chose qui ressemble à l'écran suivant :

<img class="alignnone" title="Menu global Installation Archlinux" src="http://wiki.archlinux.fr/images/8/81/06_global_menu.jpg" alt="Menu global Installation Archlinux" width="582" height="328" />

J'ai piqué la capture d'écran sur le Wiki Archlinux france, étant donné que je n'ai aps pensé à en faire pendant mon installation.

Donc là on va sélectionner les sources, donc base et base-dev pour ceux qui le souhaitent. On choisi ensuite un mirroir, j'ai une petite préférence pour ceux de OVH qui offrent un très bon débit. Et là le setup nous demande de choisir une carte réseau.

Pas de chances, il n'en trouve pas et n'arrive pas a les installer tout seul. Donc on passe sur un autre terminal CTRL+ALT+F2. On se loggue en root et on exécute un petit `lspci` afin de voir quels sont les périphériques sur l'ordinateur.

Il trouve bien une carte réseau, dont le pilote est inclu dans le kernel depuis un moment, mais impossible de lancer un dhcp dessus... Après plusieurs minutes de recherche je me dis, mais tiens Archlinux c'est des rolling releases, peut être qu'il y a un site avec des images buildés toutes les nuits. Bingo, google étant notre ami il ne m'a pas fallu longtemps pour trouver le saint Graal. [http://releng.archlinux.org/isos/](http://releng.archlinux.org/isos/ "http://releng.archlinux.org/isos/")

Le temps que je finisse cet article, la dernière release disponible sur le site officiel date du mois d'Août et embarque le kernel 3.0.3, et plusieurs autres fioritures bien utiles pour les laptop récents comme ce Dell.

Maintenant qu'on a ce qu'il nous faut on peut recommencer le process pour arriver de nouveau a cette étape de configuration du réseau. Et là, miracle, nous sommes connecté :) On ne va pas s'arrêter en si bon chemin, donc on termine cette installation. Sélection du stricte minimum comme paquets, je n'ai pas une très bonne connexion internet chez moi. Mon but n'étant pas de détailler l'installation d'un Arch Linux je ne vais pas m'étendre sur tout ce qui se passe bien, mais plutôt sur les points qui coincent. On redémarre et on arrive sur l'écran de login classique de console. On lance un petit `pacman -Syu` en root afin de mettre a jour notre installation. Et c'est la qu'arrive le deuxième point technique : l'installation de l'interface graphique.

Etant donné que le Dell embarque une nouvelle technologie de nvidia qui s'appelle Optimus. Qui permet de switcher de carte graphique (gpu ou chipset intégré) en fonction des besoins et de facto de gagner en autonomie. Seulement voilà, c'est une techno propriétaire et il n'y a encore rien d'intégré au noyau ni aucun pilote nvidia disponible. Bon on commence quand même par installer Xorg puis un gestionnaire de fenêtre. Pour ma part je me suis orienté vers Gnome 3. Libre a chacun de choisir le sien.

Une fois ces deux étapes de faites, et ben on se rend compte qu'il n'y a pas grand chose qui marche pas, et ça fait plutôt plaisir. En suivant les différentes étapes de ce site [https://wiki.archlinux.org/index.php/Dell_XPS_15z](https://wiki.archlinux.org/index.php/Dell_XPS_15z "https://wiki.archlinux.org/index.php/Dell_XPS_15z") on arive a faire marcher tout ce dont on a besoin, à commencer par la souris, qui peut être bien pratique avec une interface graphique. Le switch de carte graphique marche plutot pas mal, il faut quand même recompiler le module a chaque changement de noyau ou presque, ce qui arrive assez souvent sur cette distribution :P

Pour la souris, le point négatif c'est qu'elle ne gère pas le multi doigt sous Linux alors que sous Windows aucun soucis. Celà dit elle fonctionne très bien quand même.

Je n'ai pas de screenshot a proposer de la bête une fois configurée et en état de marche vu que je ne suis pas sur mon laptop pour terminer la redaction de cet article, mais ça va venir.

Merci d'avoir suivi mes péripéties avec l'installation de mon nouveau matériel ;) A la prochaine.
