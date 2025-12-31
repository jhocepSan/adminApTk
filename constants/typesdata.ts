
export type userCard = {
    name: string;
    age: number;
    grade: string;
    photoUri: string;
    genero: string;
};

export type usuario = {
    id: string;
    nombres: string;
    apellido: string;
    nombreclub: string;
    email: string;
    latitud: number;
    longitud: number;
};

export type imgEdit = {
    id: number;
    tipo: string;
}
export type IconSet = 'ion' | 'material';

export const DEFAULT_AVATAR ='https://cdn-icons-png.flaticon.com/512/149/149071.png';