import createClient from 'openapi-fetch';
import type { paths, components } from './schema';

// ============================================
// Types dérivés
// ============================================

/**
 * Type extrait depuis la réponse de l'API /login
 * Garantit la cohérence avec le backend
 */
export type Utilisateur = NonNullable<
    paths['/login']['post']['responses'][200]['content']['application/json']
>;

/**
 * Type pour les données d'une station Vélo'v
 */
export type Station = components['schemas']['TotalVelos'];
export type MoyenneVelos = components['schemas']['MoyenneVelos'];

// ============================================
// Configuration du client API
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = createClient<paths>({
    baseUrl: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

// ============================================
// Helper pour gérer les erreurs
// ============================================

export const handleApiError = (error: unknown): string => {
    if (error && typeof error === 'object' && 'error' in error) {
        return (error as { error: string }).error;
    }
    return 'Une erreur est survenue';
};

// ============================================
// Fonctions d'API typées
// ============================================

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (username: string, password: string) => {
    const { data, error } = await apiClient.POST('/register', {
        body: { username, password },
    });

    if (error) throw new Error(handleApiError(error));
    return data;
};

/**
 * Connexion utilisateur
 */
export const login = async (username: string, password: string) => {
    const { data, error } = await apiClient.POST('/login', {
        body: { username, password },
    });

    if (error) throw new Error(handleApiError(error));
    return data;
};

/**
 * Mise à jour du solde utilisateur
 */
export const updateMoney = async (username: string, money: number) => {
    const { data, error } = await apiClient.POST('/update_money', {
        body: { username, money },
    });

    if (error) throw new Error(handleApiError(error));
    return data;
};

/**
 * Récupère le nombre total de vélos par station
 */
export const getTotalVelos = async () => {
    const { data, error } = await apiClient.GET('/nb_total');

    if (error) throw new Error(handleApiError(error));
    return data;
};

/**
 * Récupère le nombre de vélos électriques par station
 */
export const getVelosElec = async () => {
    const { data, error } = await apiClient.GET('/nb_elec');

    if (error) throw new Error(handleApiError(error));
    return data;
};

/**
 * Récupère le nombre de vélos normaux par station
 */
export const getVelosNormal = async (numStation?: number) => {
    const { data, error } = await apiClient.GET('/nb_normal', {
        params: {
            query: numStation ? { num_station: numStation } : undefined,
        },
    });

    if (error) throw new Error(handleApiError(error));
    return data;
};

/**
 * Récupère les informations statiques des stations
 */
export const getStationsInfo = async () => {
    const { data, error } = await apiClient.GET('/info_statique');

    if (error) throw new Error(handleApiError(error));
    return data;
};
/**
 * Récupère les informations statiques des stations
 */
export const getMoyennes = async () => {
    const { data, error } = await apiClient.GET('/moyennes');

    if (error) throw new Error(handleApiError(error));
    return data;
};

/**
 * Récupère l'historique d'une station
 */
export const getStationHistory = async (
    id: number,
    type: 'normal' | 'elec' | 'total'
) => {
    const { data, error } = await apiClient.GET('/stations/{id}/{type}', {
        params: {
            path: { id, type },
        },
    });

    if (error) throw new Error(handleApiError(error));
    return data;
};

