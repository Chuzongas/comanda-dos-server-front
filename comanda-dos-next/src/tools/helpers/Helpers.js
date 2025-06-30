import RappiLogo from '../img/rappi.png'



export const NameOfToken = 'token-ephyr-comanda-dos'
export const NameOfTokenPreAuth = 'token-ephyr-comanda-dos-pre-auth'

export const BackendUri = ""

export const SplitBy = ''

export var options = {
	headers: {
		'Content-Type': 'application/json',
	}
}
// export var mmm = {
// 	headers: {
// 		'Content-Type': 'application/json',
// 		[NameOfToken]: localStorage.getItem(NameOfToken),
// 	}
// }

export var deleteOptions = {
	headers: {
		'Content-Type': 'application/json',
	}
}


// NAVBAR VARIABLES
export var navBarHeight = 100

// ANIMATION TIMING
export var animaitonDelayStandart = 100
export var animationInStandart = 250
export var animationOutStandart = 250

// CALC DIMENSIONS
export var timeToWaitToCalcHeight = 200
export var timeToWaitToCalcWidth = 10

// export const UserNameOfUser = 'username-fruteria-marilu'
// export const IdOfUser = 'id-user-fruteria-marilu'

// export const Bgc1 = '#0A60FF'


// OPTIONS FOR MENU

export var ModuloOptions = ['modulo', 'Crear nuevo elemento', 'Asignar elemento existente', 'Eliminar']
export var FolderOptions = ['folder', 'Crear nuevo elemento', 'Asignar elemento existente', 'Eliminar']
export var ProgramOptions = ['program', 'Eliminar']


// MESSAGES
export var MESSAGES = {
	ASIGN: {
		OK: 'Registro asignado con éxito',
		BAD: 'No se pudo asignar el registro, intente otra vez',
		NOT_AUTHORIZED: 'No tienes permiso para esta acción'
	},
	CREATE: {
		OK: 'Registro creado con éxito',
		BAD: 'No se pudo crear el registro, intente otra vez',
		NOT_AUTHORIZED: 'No tienes permiso para esta acción'
	},
	UPDATE: {
		OK: 'Registro actualizado con éxito',
		BAD: 'No se pudo actualizar el registro, intente otra vez',
		NOT_AUTHORIZED: 'No tienes permiso para esta acción'
	},
	DELETE: {
		OK: 'Registro eliminado con éxito',
		BAD: 'No se pudo eliminar el registro, intente otra vez',
		NOT_AUTHORIZED: 'No tienes permiso para esta acción'
	}
}


export var VARS_EMPRESAS = {
	RAPPI: {
		COLOR: "#e4624e",
		LOGO: RappiLogo
	}
}