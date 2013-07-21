-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 14, 2011 at 11:55 PM
-- Server version: 5.1.53
-- PHP Version: 5.3.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `emparejatodo`
--
CREATE DATABASE `emparejatodo` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `emparejatodo`;

-- --------------------------------------------------------

--
-- Table structure for table `barajas`
--

CREATE TABLE IF NOT EXISTS `barajas` (
  `idBaraja` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  `idUsuario` int(10) unsigned NOT NULL,
  `numCartas` int(10) unsigned NOT NULL,
  PRIMARY KEY (`idBaraja`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=62 ;

--
-- Dumping data for table `barajas`
--

INSERT INTO `barajas` (`idBaraja`, `nombre`, `idUsuario`, `numCartas`) VALUES
(27, 'nueva', 1, 4),
(60, 'jejeje', 1, 7),
(61, '88888888', 1, 5),
(57, 'ccc', 1, 3),
(59, 'bbb', 1, 7),
(42, 'aaa', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `cartas`
--

CREATE TABLE IF NOT EXISTS `cartas` (
  `idCarta` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idUsuario` int(10) unsigned NOT NULL,
  `extCarta` varchar(5) NOT NULL,
  PRIMARY KEY (`idCarta`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=40 ;

--
-- Dumping data for table `cartas`
--

INSERT INTO `cartas` (`idCarta`, `idUsuario`, `extCarta`) VALUES
(27, 1, 'jpg'),
(26, 1, 'jpg'),
(25, 1, 'jpg'),
(24, 1, 'jpg'),
(23, 1, 'jpg'),
(22, 1, 'png'),
(21, 1, 'png'),
(20, 1, 'png'),
(19, 1, 'png'),
(28, 1, 'jpg'),
(29, 1, 'jpg'),
(30, 1, 'jpg'),
(31, 1, 'jpg'),
(32, 1, 'jpg'),
(33, 1, 'jpg'),
(34, 1, 'jpg'),
(35, 1, 'jpg'),
(36, 1, 'png'),
(37, 1, 'jpg'),
(38, 1, 'jpg'),
(39, 1, 'jpg');

-- --------------------------------------------------------

--
-- Table structure for table `relcartasbarajas`
--

CREATE TABLE IF NOT EXISTS `relcartasbarajas` (
  `idRel` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rolCarta` enum('descubierta','reverso') NOT NULL,
  `idBaraja` int(10) unsigned NOT NULL,
  `idCarta` int(10) unsigned NOT NULL,
  PRIMARY KEY (`idRel`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=319 ;

--
-- Dumping data for table `relcartasbarajas`
--

INSERT INTO `relcartasbarajas` (`idRel`, `rolCarta`, `idBaraja`, `idCarta`) VALUES
(179, 'descubierta', 37, 23),
(178, 'descubierta', 37, 20),
(177, 'descubierta', 37, 19),
(124, 'reverso', 27, 20),
(123, 'descubierta', 27, 31),
(122, 'descubierta', 27, 27),
(121, 'descubierta', 27, 25),
(120, 'descubierta', 27, 23),
(21, 'descubierta', 6, 28),
(22, 'descubierta', 6, 30),
(23, 'descubierta', 6, 38),
(24, 'descubierta', 6, 26),
(25, 'descubierta', 6, 27),
(26, 'descubierta', 6, 23),
(27, 'descubierta', 6, 25),
(28, 'descubierta', 6, 33),
(29, 'reverso', 6, 31),
(311, 'descubierta', 60, 35),
(318, 'reverso', 61, 22),
(317, 'descubierta', 61, 33),
(316, 'descubierta', 61, 31),
(315, 'descubierta', 61, 27),
(181, 'reverso', 37, 31),
(180, 'descubierta', 37, 27),
(176, 'descubierta', 37, 21),
(314, 'descubierta', 61, 25),
(310, 'descubierta', 60, 32),
(313, 'descubierta', 61, 23),
(309, 'descubierta', 60, 28),
(308, 'descubierta', 60, 29),
(307, 'descubierta', 60, 20),
(289, 'descubierta', 57, 30),
(312, 'reverso', 60, 21),
(288, 'descubierta', 57, 19),
(287, 'descubierta', 57, 22),
(302, 'descubierta', 59, 32),
(301, 'descubierta', 59, 28),
(300, 'descubierta', 59, 29),
(299, 'descubierta', 59, 20),
(298, 'descubierta', 59, 30),
(297, 'descubierta', 59, 19),
(205, 'reverso', 42, 29),
(204, 'descubierta', 42, 28),
(203, 'descubierta', 42, 20),
(202, 'descubierta', 42, 22),
(306, 'descubierta', 60, 30),
(305, 'descubierta', 60, 19),
(304, 'reverso', 59, 21),
(303, 'descubierta', 59, 35),
(290, 'reverso', 57, 24);

-- --------------------------------------------------------

--
-- Table structure for table `resultados`
--

CREATE TABLE IF NOT EXISTS `resultados` (
  `idResultado` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idUsuario` varchar(20) NOT NULL,
  `fecha` datetime NOT NULL,
  `baraja` varchar(20) NOT NULL,
  `numImages` int(10) unsigned NOT NULL,
  `numCartas` int(10) unsigned NOT NULL,
  `numFilas` int(10) unsigned NOT NULL,
  `tiempoMax` int(10) unsigned NOT NULL,
  `endTime` int(10) unsigned NOT NULL,
  `finExito` tinyint(1) NOT NULL,
  `score` int(11) NOT NULL,
  `turns` int(10) unsigned NOT NULL,
  PRIMARY KEY (`idResultado`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `resultados`
--

INSERT INTO `resultados` (`idResultado`, `idUsuario`, `fecha`, `baraja`, `numImages`, `numCartas`, `numFilas`, `tiempoMax`, `endTime`, `finExito`, `score`, `turns`) VALUES
(1, '1', '2011-06-11 20:44:04', 'chachiBar', 8, 12, 3, 0, 19, 1, 40, 10),
(2, '1', '2011-06-11 20:45:27', 'barReyes', 4, 8, 3, 20, 10, 1, 30, 6),
(5, '1', '2011-06-12 04:24:55', 'nueva', 4, 12, 3, 5, 5, 0, 5, 2),
(4, '1', '2011-06-11 20:46:31', 'chachiBar', 8, 14, 2, 30, 30, 0, -5, 13);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `idUsuario` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  `apellidos` varchar(40) NOT NULL,
  `edad` int(10) unsigned NOT NULL,
  `sexo` char(1) NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `estado` enum('administrador','autorizado','solicitado','denegado') NOT NULL DEFAULT 'solicitado',
  `fechaSolicitado` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `fechaAutorizado` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `barajaDefecto` varchar(20) NOT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=24 ;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`idUsuario`, `nombre`, `apellidos`, `edad`, `sexo`, `usuario`, `password`, `estado`, `fechaSolicitado`, `fechaAutorizado`, `barajaDefecto`) VALUES
(1, 'Pepa', 'Gutierrez', 35, 'm', 'pepi', 'pepipass', 'autorizado', '0000-00-00 00:00:00', '2011-06-05 05:19:39', 'nueva'),
(9, 'Juan', 'Rodriguez', 34, 'h', 'juanito', 'juanitopass', 'autorizado', '0000-00-00 00:00:00', '2011-06-05 18:02:01', '0'),
(11, 'Julia', 'Bermudez', 22, 'm', 'julita', 'julitapass', 'administrador', '0000-00-00 00:00:00', '2011-06-06 02:12:58', '0'),
(12, 'Juan Ramon', 'Gonzalez', 44, 'h', 'ramon', 'ramonpass', 'solicitado', '2011-06-13 21:49:14', '0000-00-00 00:00:00', ''),
(13, 'Benito', 'Paredes', 55, 'h', 'benito', 'benitopass', 'solicitado', '2011-06-13 22:13:40', '0000-00-00 00:00:00', ''),
(14, 'Maria', 'Bros', 20, 'm', 'maria', 'mariapass', 'solicitado', '2011-06-13 22:31:06', '0000-00-00 00:00:00', ''),
(23, 'palomo', 'rivera', 23, 'm', 'palom', 'palompass', 'autorizado', '0000-00-00 00:00:00', '2011-06-15 01:49:24', '');
