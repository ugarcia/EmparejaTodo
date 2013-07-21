-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 19, 2011 at 08:01 PM
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
-- DROP DATABASE `ac3jyz8c_emparejatodo`;
CREATE DATABASE `ac3jyz8c_emparejatodo` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `ac3jyz8c_emparejatodo`;

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=64 ;

--
-- Dumping data for table `barajas`
--


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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=328 ;

--
-- Dumping data for table `relcartasbarajas`
--


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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `resultados`
--


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
  `barajaDefecto` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`idUsuario`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=25 ;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`idUsuario`, `nombre`, `apellidos`, `edad`, `sexo`, `usuario`, `password`, `estado`, `fechaSolicitado`, `fechaAutorizado`, `barajaDefecto`) VALUES
(1, '', '', 0, '', 'admin', '', 'administrador', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '');
