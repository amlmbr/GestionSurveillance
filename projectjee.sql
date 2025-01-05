-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 05 jan. 2025 à 03:04
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `projectjee`
--

-- --------------------------------------------------------

--
-- Structure de la table `app_role`
--

CREATE TABLE `app_role` (
  `id` bigint(20) NOT NULL,
  `rolename` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `app_user`
--

CREATE TABLE `app_user` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `app_user`
--

INSERT INTO `app_user` (`id`, `email`, `password`, `username`) VALUES
(3, 'nadounettenadia@gmail.com', '$2a$10$oW7wOwx9CGAOWH/BtG5ulORWuA/8f7tTVTCLdroVwIRT/JeWHTf.e', 'ilyassmandour');

-- --------------------------------------------------------

--
-- Structure de la table `app_user_roles`
--

CREATE TABLE `app_user_roles` (
  `app_user_id` bigint(20) NOT NULL,
  `roles_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `departement`
--

CREATE TABLE `departement` (
  `id` bigint(20) NOT NULL,
  `nom` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `departement`
--

INSERT INTO `departement` (`id`, `nom`) VALUES
(60, 'Electrique'),
(61, 'Informatique'),
(70, 'Genie Civil');

-- --------------------------------------------------------

--
-- Structure de la table `enseignant`
--

CREATE TABLE `enseignant` (
  `est_dispense` bit(1) NOT NULL,
  `est_reserviste` bit(1) NOT NULL,
  `nb_surveillances` int(11) NOT NULL,
  `departement_id` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `enseignant`
--

INSERT INTO `enseignant` (`est_dispense`, `est_reserviste`, `nb_surveillances`, `departement_id`, `id`, `email`, `nom`, `prenom`) VALUES
(b'0', b'0', 8, 60, 5, 'ferttat@gmail.com', 'Ferttat', 'Mohammed'),
(b'0', b'0', 24, 61, 9, 'lachgar@gmail.com', 'lachgar', 'mohammed'),
(b'0', b'0', 4, 61, 11, 'omar@gmail.com', 'Boutkhoum', 'Omar'),
(b'0', b'0', 6, 61, 15, 'hanine@gmail.com', 'Hanine', 'mohammed'),
(b'0', b'0', 5, 61, 16, 'chafik@gmail.com', 'Baidaida', 'Chafik'),
(b'0', b'0', 5, 61, 17, 'silkane@gmail.com', 'Silkane', 'mohammed');

-- --------------------------------------------------------

--
-- Structure de la table `examen`
--

CREATE TABLE `examen` (
  `date` date DEFAULT NULL,
  `nb_etudiants` int(11) NOT NULL,
  `departement_id` bigint(20) DEFAULT NULL,
  `enseignant_id` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `module_id` bigint(20) NOT NULL,
  `option_id` bigint(20) NOT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `horaire` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `examen`
--

INSERT INTO `examen` (`date`, `nb_etudiants`, `departement_id`, `enseignant_id`, `id`, `module_id`, `option_id`, `session_id`, `horaire`) VALUES
('2024-12-27', 138, 61, 11, 16, 23, 3, 1, '08:00-10:00'),
('2024-12-27', 44, 61, 9, 17, 4, 3, 1, '10:00-12:00');

-- --------------------------------------------------------

--
-- Structure de la table `examen_locaux`
--

CREATE TABLE `examen_locaux` (
  `local_id` int(11) NOT NULL,
  `examen_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `examen_locaux`
--

INSERT INTO `examen_locaux` (`local_id`, `examen_id`) VALUES
(22, 16),
(34, 16),
(34, 17);

-- --------------------------------------------------------

--
-- Structure de la table `jours_feries`
--

CREATE TABLE `jours_feries` (
  `id` bigint(20) NOT NULL,
  `date` date DEFAULT NULL,
  `titre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `jours_feries`
--

INSERT INTO `jours_feries` (`id`, `date`, `titre`) VALUES
(5, '2024-12-26', 'jour 1');

-- --------------------------------------------------------

--
-- Structure de la table `local`
--

CREATE TABLE `local` (
  `capacite` int(11) NOT NULL,
  `est_disponible` bit(1) NOT NULL,
  `id` int(11) NOT NULL,
  `nb_surveillants` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `local`
--

INSERT INTO `local` (`capacite`, `est_disponible`, `id`, `nb_surveillants`, `nom`, `type`) VALUES
(100, b'1', 22, 3, 'amphi 2', 'Amphithéâtre'),
(25, b'1', 23, 2, 'C1', 'Salle'),
(30, b'1', 24, 2, 'C2', 'Salle'),
(50, b'1', 33, 2, 'amphi 3', 'Amphithéâtre'),
(45, b'1', 34, 3, 'B2', 'Salle'),
(30, b'1', 35, 1, 'B1', 'Salle');

-- --------------------------------------------------------

--
-- Structure de la table `module`
--

CREATE TABLE `module` (
  `enseignant_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL,
  `option_id` bigint(20) NOT NULL,
  `nom` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `module`
--

INSERT INTO `module` (`enseignant_id`, `id`, `option_id`, `nom`) VALUES
(9, 4, 3, 'MOBILE'),
(15, 16, 3, 'Base de donnes'),
(16, 17, 3, 'Python'),
(11, 23, 3, 'JEE'),
(15, 24, 3, 'BI');

-- --------------------------------------------------------

--
-- Structure de la table `options`
--

CREATE TABLE `options` (
  `departement_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL,
  `nom` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `options`
--

INSERT INTO `options` (`departement_id`, `id`, `nom`) VALUES
(61, 3, '2ITE'),
(60, 4, 'ISIC'),
(61, 13, 'GI'),
(61, 21, 'CCN'),
(60, 22, 'GC'),
(60, 23, 'GEE');

-- --------------------------------------------------------

--
-- Structure de la table `session`
--

CREATE TABLE `session` (
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `end1` varchar(255) DEFAULT NULL,
  `end2` varchar(255) DEFAULT NULL,
  `end3` varchar(255) DEFAULT NULL,
  `end4` varchar(255) DEFAULT NULL,
  `start1` varchar(255) DEFAULT NULL,
  `start2` varchar(255) DEFAULT NULL,
  `start3` varchar(255) DEFAULT NULL,
  `start4` varchar(255) DEFAULT NULL,
  `type_session` varchar(255) DEFAULT NULL,
  `confirmed` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `session`
--

INSERT INTO `session` (`date_debut`, `date_fin`, `id`, `end1`, `end2`, `end3`, `end4`, `start1`, `start2`, `start3`, `start4`, `type_session`, `confirmed`) VALUES
('2024-12-26', '2024-12-31', 1, '10:00', '12:00', '16:00', '18:00', '08:00', '10:00', '14:00', '16:00', 'NORMALE_HIVER', b'0');

-- --------------------------------------------------------

--
-- Structure de la table `student`
--

CREATE TABLE `student` (
  `id` bigint(20) NOT NULL,
  `cin` varchar(255) DEFAULT NULL,
  `cne` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `option_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `student`
--

INSERT INTO `student` (`id`, `cin`, `cne`, `nom`, `prenom`, `option_id`) VALUES
(25, 'M650449', 'K13455049', 'Lahlyal', 'Ahmed Moubrak', 3),
(26, 'M65220', 'K1467098', 'Fihri', 'Yasmine', 3),
(27, 'E4587623', 'K12446528', 'Boulknadale', 'Abderahmane', 3),
(28, 'M54980', 'K22213445', 'Mandour', 'Ilyass', 3),
(29, 'H1234678', 'K45276713', 'Khaled', 'yazid', 13),
(30, 'M546783', 'K22213445', 'Guenone', 'Soufiane', 13),
(31, 'H2315689', 'K12345687', 'karime', 'Badrediine', 4),
(32, 'M124566', 'K12345687', 'Karimeedinne', 'Anwar', 4);

-- --------------------------------------------------------

--
-- Structure de la table `surveillance_assignation`
--

CREATE TABLE `surveillance_assignation` (
  `local_id` int(11) DEFAULT NULL,
  `departement_id` bigint(20) DEFAULT NULL,
  `enseignant_id` bigint(20) DEFAULT NULL,
  `examen_id` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `module_id` bigint(20) DEFAULT NULL,
  `option_id` bigint(20) DEFAULT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `type_surveillant` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `surveillance_assignation`
--

INSERT INTO `surveillance_assignation` (`local_id`, `departement_id`, `enseignant_id`, `examen_id`, `id`, `module_id`, `option_id`, `session_id`, `type_surveillant`) VALUES
(22, 61, 11, 16, 132, 23, 3, 1, 'TT'),
(22, 61, 17, 16, 133, 23, 3, 1, 'PRINCIPAL'),
(22, 61, 15, 16, 134, 23, 3, 1, 'RESERVISTE'),
(22, 61, 16, 16, 135, 23, 3, 1, 'PRINCIPAL'),
(34, 61, 9, 16, 136, 23, 3, 1, 'PRINCIPAL'),
(34, 61, 9, 17, 137, 4, 3, 1, 'TT'),
(34, 61, 11, 17, 138, 4, 3, 1, 'PRINCIPAL'),
(34, 61, 17, 17, 139, 4, 3, 1, 'PRINCIPAL');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `app_role`
--
ALTER TABLE `app_role`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `app_user`
--
ALTER TABLE `app_user`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `app_user_roles`
--
ALTER TABLE `app_user_roles`
  ADD KEY `FK1pfb2loa8so5oi6ak7rh6enva` (`roles_id`),
  ADD KEY `FKkwxexnudtp5gmt82j0qtytnoe` (`app_user_id`);

--
-- Index pour la table `departement`
--
ALTER TABLE `departement`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `enseignant`
--
ALTER TABLE `enseignant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKojyp6w14d0f9w4r1vrddgnisu` (`departement_id`);

--
-- Index pour la table `examen`
--
ALTER TABLE `examen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlpl9ndm9aw6mipyh54ektm2pw` (`departement_id`),
  ADD KEY `FKlhpuj1sess79ydmesfecvs6bk` (`enseignant_id`),
  ADD KEY `FKrtumkd5pafmdbg6pnb4u38b57` (`module_id`),
  ADD KEY `FK732nm715q23e6a7elqurp5w1s` (`option_id`),
  ADD KEY `FKgcox8su1h8ehcjnl8eyisbxqy` (`session_id`);

--
-- Index pour la table `examen_locaux`
--
ALTER TABLE `examen_locaux`
  ADD PRIMARY KEY (`local_id`,`examen_id`),
  ADD KEY `FK8yk5g2hu0q09lymq2msgx30sl` (`examen_id`);

--
-- Index pour la table `jours_feries`
--
ALTER TABLE `jours_feries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKkjbqytgy2d50wggbncwo2bd9v` (`date`);

--
-- Index pour la table `local`
--
ALTER TABLE `local`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlq7bhac55vy7ou3pa0s4tbxh5` (`option_id`),
  ADD KEY `FK7r77eb9cqg9yls08rwsr9hely` (`enseignant_id`);

--
-- Index pour la table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKdriyok46mwe5ja4i1jrhuj2a4` (`departement_id`);

--
-- Index pour la table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKhurvqx9541xlpaopi57ghjbsk` (`option_id`);

--
-- Index pour la table `surveillance_assignation`
--
ALTER TABLE `surveillance_assignation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKkvg5mbv9qj4hi4t44t9wp0vuu` (`departement_id`),
  ADD KEY `FKr9i4u55d3bn4j2q57rgm0b7v6` (`enseignant_id`),
  ADD KEY `FK6hehqyfoda2trjjk8got6dhq2` (`examen_id`),
  ADD KEY `FKpnys8y3o7crpslvtj9repe5g` (`local_id`),
  ADD KEY `FKa8o6a6k9lvv21ywly0h6jljes` (`module_id`),
  ADD KEY `FK201n9somenqthtxbyx1i2h3pm` (`option_id`),
  ADD KEY `FK8sb344br8kopk49rms922aurs` (`session_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `app_role`
--
ALTER TABLE `app_role`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `app_user`
--
ALTER TABLE `app_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `departement`
--
ALTER TABLE `departement`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT pour la table `enseignant`
--
ALTER TABLE `enseignant`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `examen`
--
ALTER TABLE `examen`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `jours_feries`
--
ALTER TABLE `jours_feries`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `local`
--
ALTER TABLE `local`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT pour la table `module`
--
ALTER TABLE `module`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `options`
--
ALTER TABLE `options`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `session`
--
ALTER TABLE `session`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `student`
--
ALTER TABLE `student`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `surveillance_assignation`
--
ALTER TABLE `surveillance_assignation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `app_user_roles`
--
ALTER TABLE `app_user_roles`
  ADD CONSTRAINT `FK1pfb2loa8so5oi6ak7rh6enva` FOREIGN KEY (`roles_id`) REFERENCES `app_role` (`id`),
  ADD CONSTRAINT `FKkwxexnudtp5gmt82j0qtytnoe` FOREIGN KEY (`app_user_id`) REFERENCES `app_user` (`id`);

--
-- Contraintes pour la table `enseignant`
--
ALTER TABLE `enseignant`
  ADD CONSTRAINT `FKojyp6w14d0f9w4r1vrddgnisu` FOREIGN KEY (`departement_id`) REFERENCES `departement` (`id`);

--
-- Contraintes pour la table `examen`
--
ALTER TABLE `examen`
  ADD CONSTRAINT `FK732nm715q23e6a7elqurp5w1s` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`),
  ADD CONSTRAINT `FKgcox8su1h8ehcjnl8eyisbxqy` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FKlhpuj1sess79ydmesfecvs6bk` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignant` (`id`),
  ADD CONSTRAINT `FKlpl9ndm9aw6mipyh54ektm2pw` FOREIGN KEY (`departement_id`) REFERENCES `departement` (`id`),
  ADD CONSTRAINT `FKrtumkd5pafmdbg6pnb4u38b57` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`);

--
-- Contraintes pour la table `examen_locaux`
--
ALTER TABLE `examen_locaux`
  ADD CONSTRAINT `FK8au4dqs1o7wk7ckhqfhn14cfd` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`),
  ADD CONSTRAINT `FK8yk5g2hu0q09lymq2msgx30sl` FOREIGN KEY (`examen_id`) REFERENCES `examen` (`id`);

--
-- Contraintes pour la table `module`
--
ALTER TABLE `module`
  ADD CONSTRAINT `FK7r77eb9cqg9yls08rwsr9hely` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignant` (`id`),
  ADD CONSTRAINT `FKlq7bhac55vy7ou3pa0s4tbxh5` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`);

--
-- Contraintes pour la table `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `FKdriyok46mwe5ja4i1jrhuj2a4` FOREIGN KEY (`departement_id`) REFERENCES `departement` (`id`);

--
-- Contraintes pour la table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `FKhurvqx9541xlpaopi57ghjbsk` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`);

--
-- Contraintes pour la table `surveillance_assignation`
--
ALTER TABLE `surveillance_assignation`
  ADD CONSTRAINT `FK201n9somenqthtxbyx1i2h3pm` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`),
  ADD CONSTRAINT `FK6hehqyfoda2trjjk8got6dhq2` FOREIGN KEY (`examen_id`) REFERENCES `examen` (`id`),
  ADD CONSTRAINT `FK8sb344br8kopk49rms922aurs` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FKa8o6a6k9lvv21ywly0h6jljes` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  ADD CONSTRAINT `FKkvg5mbv9qj4hi4t44t9wp0vuu` FOREIGN KEY (`departement_id`) REFERENCES `departement` (`id`),
  ADD CONSTRAINT `FKpnys8y3o7crpslvtj9repe5g` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`),
  ADD CONSTRAINT `FKr9i4u55d3bn4j2q57rgm0b7v6` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignant` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
