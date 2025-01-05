# GestionSurveillance
# ExamWatch - Système de Gestion de Surveillance des Examens

![Gestion De Surveillance](https://github.com/user-attachments/assets/2cdd8aaa-af3d-4ce9-bdc9-0f665b895306)

## Description
ExamWatch est une application web complète conçue pour gérer efficacement la surveillance des examens dans les établissements d'enseignement. Elle offre une interface intuitive pour l'administration des examens, la gestion des surveillants, et le suivi des sessions d'examens en temps réel.

## Table des matières
- [Objectifs](#objectifs)
- [Architecture du projet](#Architecture du projet)
- [Fonctionnalités Principales](#fonctionnalités-principales)
  - [Gestion des Utilisateurs et Authentification](#gestion-des-utilisateurs-et-authentification)
  - [Gestion des Ressources](#gestion-des-ressources)
  - [Gestion des Examens](#gestion-des-examens)
  - [Import/Export de Données](#importexport-de-données)
  - [Assistant Virtuel Académique](#assistant-virtuel-académique)
- [Technologies Utilisées](#technologies-utilisées)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Base de données](#base-de-données)
- [Configuration et Installation](#configuration-et-installation)
  - [Prérequis](#prérequis)
  - [Configuration de la Base de Données](#configuration-de-la-base-de-données)
  - [Installation du Backend](#installation-du-backend)
  - [Installation du Frontend](#installation-du-frontend)
- [Variables d'Environnement](#variables-denvironnement)
- [Vidéo démonstrative](#video-demonstratifs)
- [Contribution](#contribution)

## Objectifs
- Automatiser la gestion des distributions des locaux
- Automatiser la gestion des surveillances d'examens
- Optimiser l'attribution des surveillants aux examens
- Faciliter la gestion des ressources (locaux, départements, modules, options)
- Assistant virtuel
- Assurer un suivi précis des sessions d'examens
- Fournir des outils d'analyse et de reporting

##Architecture du projet


## Fonctionnalités Principales
### Gestion des Utilisateurs et Authentification
- Authentification sécurisée avec JWT
- Connexion via Google OAuth2
- Gestion des sessions utilisateurs
- Différents niveaux d'accès (Admin)

### Gestion des Ressources
- CRUD complet pour :
  - Départements
  - Locaux
  - Options/Filières
  - Modules
  - Enseignants
  - Étudiants

### Gestion des Examens
- Planification des examens
- Attribution automatique des surveillants
- Gestion des créneaux horaires
- Suivi des présences

### Import/Export de Données
- Export des données en Excel et PDF
- Import en masse via fichiers CSV pour :
  - Départements
  - Options
  - Locaux
  - Étudiants
  - Modules
  - Enseignants

### Assistant Virtuel Académique
- Interface conversationnelle pour les requêtes académiques
- Accès rapide aux informations de surveillance
- Consultation des plannings d'examens

## Technologies Utilisées
### Backend
- Java 17
- Spring Boot 3.4.0
- Spring Security
- Spring AI
- JWT pour l'authentification
- JPA/Hibernate
- MySQL

### Frontend
- React.js
- Material-UI
- Redux pour la gestion d'état
- Axios pour les requêtes HTTP

### Base de données
- MySQL via XAMPP

## Configuration et Installation
### Prérequis
- JDK 21 ou supérieur
- Node.js 18.20.4 ou supérieur
- XAMPP (MySQL)
- Maven 4.0.0

### Configuration de la Base de Données
1. Démarrer XAMPP et activer MySQL
2. La base de données sera créée automatiquement lors du premier lancement "base de donner name : projectjee"

### Installation du Backend
1. Cloner le repository
```bash
git clone https://github.com/amlmbr/GestionSurveillance.git
cd GestionSurveillance/Backend
```

2. Configurer les variables d'environnement dans `application.properties`
   - Les paramètres par défaut sont déjà configurés pour un environnement de développement local

3. Lancer l'application
```bash
mvn spring-boot:run
```
Le serveur démarrera sur `http://localhost:8082`

4. Si il se lance erreur port 8082 déjà utilisé
```bash
netstat -ano |findstr 8082
```
```bash
taskkill /PID <NUMBER> /F
```

### Installation du Frontend
1. Naviguer vers le dossier frontend
```bash
cd ../Frontend
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer l'application
```bash
npm start
```
L'application sera accessible sur `http://localhost:3000`

## Variables d'Environnement
Les variables suivantes doivent être configurées dans `application.properties` :
- Configuration de la base de données
- Paramètres SMTP pour les emails
- Clés d'API pour Google OAuth2

## video demonstratifs

## Contribution

<table>
  <tr>
    <td align="center">
      <p>Lahlyal Ahmed Moubarak </p>
      <a href="https://github.com/amlmbr">
        <img src="https://github.com/amlmbr.png" width="100px;" alt="Lahiyal ahmed moubarak"/><br />
        <sub><b>Lahiyal ahmed moubarak</b></sub>
      </a>
    </td>
    <td align="center">
       <p>Fihri Yasmine</p>
      <a href="https://github.com/bouleknadel">
       <img src="https://github.com/yasminefhr1.png" width="100px;" alt="yasminefhr1"/><br />
        <sub><b>yasminefhr1</b></sub>
      </a>
    </td>
    <td align="center">
       <p>Mandor Ilyass</p>
      <a href="https://github.com/ilyassman">
        <img src="https://github.com/ilyassman.png" width="100px;" alt="ilyassman"/><br />
        <sub><b>ilyassman</b></sub>
      </a>
    </td>
    <td align="center">
       <p>Abderrahmane Bouleknadel </p>
      <a href="https://github.com/yasminefhr1">
        <img src="https://github.com/bouleknadel.png" width="100px;" alt="Abderrahmane Bouleknadel"/><br />
        <sub><b>Abderrahmane Bouleknadel</b></sub>
      </a>
    </td>
  </tr>
</table>
