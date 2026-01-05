
export type userCard = {
    idestudiante:number;
    name: string;
    age: number;
    grade: string;
    photoUri: string;
    genero: string;
};
export type estuAsisType={
    idestudi:number;
    iddato:number;
    idclub:number;
    idcinturon:number;
    idadjunto:number;
    idperiodo:number;
    idubicacion:number;
    estado:string;
    name_estado:string;
    nombres: string;
    apellidos: string;
    fecha_nac:string;
    genero: string;
    mame_genero:string;
    edad: number;
    ci: number;
    celular:number;
    name_club:string;
    direccion:string;
    imagen: string;
    name_cinturon:string;
    colores:string;
    latitud:number;
    longitud:number;
    dia:string;
    hora_ini:string;
    hora_fin:string;
    nombre_docente:string;
    presente:number;
    estado_presente:string;
    idasistencia:number;
}
export type estudianteType={
    idestudi:number;
    iddato:number;
    idclub:number;
    idcinturon:number;
    idadjunto:number;
    idperiodo:number;
    idubicacion:number;
    estado:string;
    name_estado:string;
    nombres: string;
    apellidos: string;
    fecha_nac:string;
    genero: string;
    mame_genero:string;
    edad: number;
    ci: number;
    celular:number;
    name_club:string;
    direccion:string;
    imagen: string;
    name_cinturon:string;
    colores:string;
    latitud:number;
    longitud:number;
    dia:string;
    hora_ini:string;
    hora_fin:string;
    nombre_docente:string;
}
export type docenteCard = {
    iddocente:number;
    iddato:number;
    idclub:number;
    idcinturon:number;
    idadjunto:number;
    estado:string;
    name_estado:string;
    nombres: string;
    apellidos: string;
    especialidad:string;
    fecha_nac:string;
    edad: number;
    ci: number;
    celular:number;
    name_club:string;
    imagen: string;
    genero: string;
    mame_genero:string;
    cinturon:string;
    colores:string;
    latitud:number;
    longitud:number;
};

export type cinturonType = {
    idcinturon:number;
    idclub:number;
    nombre:string;
    colores:string;
    estado:number;
    name_estado:string;
}
export type usuario = {
    id: string;
    nombres: string;
    apellido: string;
    nombreclub: string;
    email: string;
    latitud: number;
    longitud: number;
};

export type horarioType = {
    idhorario:number;
    idclub:number;
    idperiodo:number;
    dia:string;
    iddocente:number;
    limite_alumnos:number;
    cant_alumnos:number;
    descripcion:string;
    activo:number;
    hora_ini:string;
    hora_fin:string;
    nombre_docente:string;
}
export type imgEdit = {
    id: number;
    tipo: string;
}
export type diaType = {
    id:string;
    label:string;
    icon:string;
}
export type IconSet = 'ion' | 'material';

export const DEFAULT_AVATAR ='https://cdn-icons-png.flaticon.com/512/149/149071.png';

export const DIAS_SEMANA =[
    { id: 'L', label: 'Lunes', icon: 'calendar-outline' },
    { id: 'M', label: 'Martes', icon: 'calendar-outline' },
    { id: 'MI', label: 'Miércoles', icon: 'calendar-outline' },
    { id: 'J', label: 'Jueves', icon: 'calendar-outline' }, 
    { id: 'V', label: 'Viernes', icon: 'calendar-outline' },
    { id: 'S', label: 'Sábado', icon: 'calendar-outline' },
    { id: 'D', label: 'Domingo', icon: 'calendar-outline' },
]