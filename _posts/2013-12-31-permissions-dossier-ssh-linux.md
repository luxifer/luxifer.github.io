---
layout: post
title: "Permissions sur le dossier .ssh de linux"
description: ""
category: 
tags:
- linux
- ssh
- chmod
- permissions
meta:
  thumb: 'hacking_matrix.png'
---

Je ne sais pas si certains d'entre vous ont déjà eu ce problème. La connexion ssh par clé publique est bien configurée, et pourtant ssh demande quand même un mot de passe. Dans la plupart des cas il s'agit d'un problème de permissions sur le dossier `.ssh`. Voici les bonnes permissions à appliquer sur ce dossier :
<!--break-->
{% highlight bash %}
# dossier .ssh

drwxr-xr-x  2 luxifer luxifer 4096 oct.  18 20:11 .
drwx------ 21 luxifer luxifer 4096 déc.  30 10:59 ..
-rw-r--r--  1 luxifer luxifer  803 oct.  18 20:11 authorized_keys
-rw-------  1 luxifer luxifer 1675 oct.  16 15:43 id_rsa
-rw-r--r--  1 luxifer luxifer  404 oct.  16 15:43 id_rsa.pub
{% endhighlight %}

{% highlight bash %}
# dossier home

drwxr-xr-x   2 luxifer luxifer  4096 oct.  18 20:11 .ssh
{% endhighlight %}

Pour la petite explication, dans le dossier `.ssh`, le dossier `..` doit avoir un chmod de **700** qui autorise seulement le propriétaire à aller vers le dossier supérieur. De ce fait lors de la connexion ssh, tant qu'on est pas connecté, le dossier home est protégé. ensuite, les fichiers `authorized_keys` et `id_rsa.pub` doivent être en chmod **644** car ce sont eux qui sont utiles lors de la connexion. Pour finir le ficher `id_rsa` doit être en chod **600** car c'est la clé privée.

Ensuite dans le dossier home, le dossier `.ssh` doit être en chmod **755** car ssh a besoin d'y accéder lors de la connexion.

Et voilà :)
