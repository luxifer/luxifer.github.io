---
layout: post
title: Les bonnes pratiques de développement - partie 1
tags:
- dev
- développement
- équipe
- team
status: publish
type: post
published: true
meta:
  thumb: false
---
Voilà bien un sujet pour lequel j'ai pu discuter pendant des heures cumulées autour de la machine à café. Ce sujet sera traité en plusieurs articles, pour qu'il soit plus digeste à lire. Je mettrai à jour au cours de l'écritures les références vers les différentes parties.

## Disclaimer

Tout ce que je vais écrire dans cette série d'article reflète uniquement ma propre opinion.

## Introduction

Commençons par définir le périmètre des _bonnes pratiques de développement_. Pour moi ce sujet couvre l'organisation de l'équipe, la façon de répondre à un besoin, son implication dans le projet, la façon de concevoir et d'écrire du code, le tester. Dans cette première partie je vais traiter le niveau humain.

## L'humain

En tant que développeur on est avant tout un humain, ce qui implique des relations sociales et pas seulement homme - machine. On voit ce type de relation à tous les niveaux. Dans le métro pour aller au travail, autour de la machine à café, il s'agit le plus souvent de relations informelles. Au travail on les retrouves lors de réunions, de rendez-vous, mais aussi lorsqu'on répond à un email, un ticket de bug. Il y a toujours quelqu'un de l'autre côté qui va lire et interpréter ce qu'on a écris. Le plus souvent pas comme on le pensait car on a tous des grilles de perception différentes. C'est pourquoi être un bon développeur c'est avant tout savoir bien communiquer, tant à l'oral qu'à l'écrit.

## Communication orale

C'est un type de communication facile, en face à face, au téléphone, skype, whatever. C'est très pratique, mais très souvent un piège. Par exemple, ton client t'appelle, te demande de faire telle ou telle correction _urgente_, toi tu t'exécute, et là, le lendemain ou la semaine suivante, on te demande d'ou sort cette demande. Comment la justifier ? impossible... Ce genre de problèmes m'est arrivé plusieurs fois, c'est pourquoi depuis je pars du principe que **toute** communication orale est **informelle**. Dès qu'il s'agit d'une communication formelle, je retranscris par écrit.

## Communication écrite

Là non plus ce n'est pas si simple. Certes, c'est écrit, mais toujours sujet à interprétation. Chaque personne à son vécu, son éducation, etc. Bref on a tous un milliards de facteurs qui font qu'on va interpréter différemment ce qu'on lit. C'est pourquoi il faut être **explicite** au maximum sur le message qu'on veut faire passer. Par exemple, si un ticket est vague, toujours demander un maximum d'explications aux personnes concernées avant de se lancer dans le code. Car au final ça retombe souvent sur le développeur et on peut se retrouver à avoir travailler pendant une semaine pour rien... Un cahier des charges est toujours soumit au changement, et sur un projet en perpétuelle évolution, difficile d'écrire un cahier des charges qui couvre tout de manière exhaustive. En tant que développeur, j'essaye de toujours avoir une trace de tout ce qui est fait sur les projets sur lesquels je travaille. Tickets, mails, historique git, _pull request_, etc.

## Gestion du temps

Bien coder, s'est aussi bien gérer son temps. Ça commence par l'estimation d'une tâche, souvent fausse car on a jamais tous les paramètres. Mais c'est aussi la façon de le découper dans la journée pour allouer tant de temps aux mails, tant au code, et ainsi de suite. En tant que développeur on a souvent besoin de longue session non interrompue de code. Car le changement de tâche a un coût. Si on commence une tâche, qu'au bout d'une heure on reçoit un mail ou un appel, et qu'en suite on retourne dans le code, il va falloir du temps pour retrouver où on en était. J'essaye donc au maximum de dépiler mes mails en début de journée, faire un tour des tickets, en choisir un et m'y atteler. J'essaye de préférence d'avoir des tâches ayant un périmètre le plus petit possible, ainsi je peux en traiter plusieurs dans la journée. C'est beaucoup plus motivant car à la fin de la journée on à l'impression d'avoir abattu beaucoup de travail. Ce n'est pas toujours possible, certaines demandes peuvent nécessiter plusieurs jours. Dans ce type de tâche il est important de se définir plusieurs objectifs afin qu'elles ne paraissent pas insurmontables.

## Conclusion

Pour être un bon développeur, il faut donc savoir communiquer et bien gérer son temps. Dans le prochain article je rentrerai plus en détail sur le code. La façon de l'organiser, gérer un environnement de développement, comment éviter les régressions. Si vous avez des questions, des remarques, des choses à ajouter, n'hésitez pas à utiliser les commentaires pour m'en faire part.
