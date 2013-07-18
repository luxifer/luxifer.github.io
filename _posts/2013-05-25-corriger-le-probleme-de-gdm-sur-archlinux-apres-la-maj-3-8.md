---
layout: post
title: "Corriger le problème de GDM sur Archlinux après la màj 3.8"
description: ""
category: 
tags:
- system
- linux
- gnome
- archlinux
meta:
  thumb: 'gnome-3-8.png'
---
Bonjour,

Je ne pense pas être le seul a avoir eu ce problème étant donné qu'il est dans le [wiki](https://wiki.archlinux.org/index.php/GDM "GDM") d'Archlinux.
Après la dernière mise à jour majeur de gnome vers la version 3.8, gdm ne se lance plus et impossible de trouver pourquoi dans les logs.
Le problème vient de la méthode d'accélération du pilote graphique intel. Par défaut c'est `UXA` qui est plus stable techniquement mais qui est plus lente que la méthode `SNA`.
Il faut donc changer de méthode pour passer à `SNA` qui est plus rapide et nécessaire pour gnome.

{% highlight bash %}
#/etc/X11/xorg.conf.d/20-intel.conf

Section "Device"
   Identifier  "Intel Graphics"
   Driver      "intel"
   Option      "AccelMethod"  "sna"
EndSection
{% endhighlight %}

Il suffit de redémarrer et le tour est joué.