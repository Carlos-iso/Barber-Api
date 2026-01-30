import { HaircutStyle, BeardStyle } from '@/types/barber';
import teste from '@/images/teste.jpeg';
import teste2 from '@/images/teste2.jpeg';

export const haircutStyles: HaircutStyle[] = [
  {
    id: 'fade',
    name: 'Degradê',
    icon: 'TrendingDown',
    description: 'Corte com transição suave',
    defaultImage: '/images/haircuts/fade.jpg',
  },
  {
    id: 'social',
    name: 'Social',
    icon: 'User',
    description: 'Corte clássico e elegante',
    defaultImage: '/images/haircuts/social.jpg',
  },
  {
    id: 'undercut',
    name: 'Undercut',
    icon: 'Layers',
    description: 'Laterais raspadas, topo longo',
    defaultImage: '/images/haircuts/undercut.jpg',
  },
  {
    id: 'buzz',
    name: 'Máquina Zero',
    icon: 'Zap',
    description: 'Corte rente uniforme',
    defaultImage: '/images/haircuts/buzz.jpg',
  },
  {
    id: 'pompadour',
    name: 'Pompadour',
    icon: 'Crown',
    description: 'Volume no topo',
    defaultImage: '/images/haircuts/pompadour.jpg',
  },
  {
    id: 'crew',
    name: 'Crew Cut',
    icon: 'Shield',
    description: 'Corte militar moderno',
    defaultImage: '/images/haircuts/crew.jpg',
  },
];

export const beardStyles: BeardStyle[] = [
  {
    id: 'full',
    name: 'Barba Cheia',
    icon: 'Square',
    description: 'Barba completa e volumosa',
    defaultImage: '/images/beards/full.jpg',
  },
  {
    id: 'designed',
    name: 'Desenhada',
    icon: 'PenTool',
    description: 'Contornos bem definidos',
    defaultImage: '/images/beards/designed.jpg',
  },
  {
    id: 'goatee',
    name: 'Cavanhaque',
    icon: 'Triangle',
    description: 'Apenas queixo e bigode',
    defaultImage: '/images/beards/goatee.jpg',
  },
  {
    id: 'fade-beard',
    name: 'Degradê',
    icon: 'TrendingDown',
    description: 'Transição suave do cabelo',
    defaultImage: '/images/beards/fade-beard.jpg',
  },
  {
    id: 'stubble',
    name: 'Por Fazer',
    icon: 'Minus',
    description: 'Barba curta e rente',
    defaultImage: '/images/beards/stubble.jpg',
  },
  {
    id: 'clean',
    name: 'Limpa',
    icon: 'Sparkles',
    description: 'Rosto completamente liso',
    defaultImage: '/images/beards/clean.jpg',
  },
];

export const cuttingMethods = [
  { id: 'scissors', label: 'Tesoura', icon: 'Scissors', backgroundImage: teste },
  { id: 'machine', label: 'Máquina', icon: 'Zap', backgroundImage: teste2},
] as const;

export const machineHeights = [
  { id: '0.5', label: '0.5', icon: 'Ruler' },
  { id: '1.0', label: '1.0', icon: 'Ruler' },
  { id: '1.5', label: '1.5', icon: 'Ruler' },
  { id: '2', label: '2', icon: 'Ruler' },
  { id: '3', label: '3', icon: 'Ruler' },
  { id: '4', label: '4', icon: 'Ruler' },
] as const;

export const sideStyles = [
  { id: 'fade', label: 'Degradê', icon: 'TrendingDown' },
  { id: 'straight', label: 'Reto', icon: 'Minus' },
  { id: 'razor', label: 'Navalhado', icon: 'Slash' },
] as const;

export const fadeTypes = [
  { id: 'high', label: 'High Fade', icon: 'ArrowUp', description: 'Degradê alto' },
  { id: 'mid', label: 'Mid Fade', icon: 'Minus', description: 'Degradê médio' },
  { id: 'low', label: 'Low Fade', icon: 'ArrowDown', description: 'Degradê baixo' },
] as const;

export const finishStyles = [
  { id: 'natural', label: 'Natural', icon: 'Leaf' },
  { id: 'defined', label: 'Marcado', icon: 'Target' },
] as const;

export const beardHeights = [
  { id: 'short', label: 'Curta', icon: 'Minus' },
  { id: 'medium', label: 'Média', icon: 'Equal' },
  { id: 'long', label: 'Longa', icon: 'Menu' },
] as const;

export const beardContours = [
  { id: 'natural', label: 'Natural', icon: 'Leaf' },
  { id: 'defined', label: 'Marcado', icon: 'Target' },
] as const;