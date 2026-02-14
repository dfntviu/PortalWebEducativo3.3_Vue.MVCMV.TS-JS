<script setup lang="ts">
	import {computed,ref} from 'vue';

	interface Props {
		photoURL?: string;
		nombre?: string;
		apellidos?: string;
		email?: string;
		role?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		showRelaseBadge?: boolean;
		showStatusBadge?: boolean;
		isActive?: boolean;
		showBorder?: boolean;
		customColor?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {
		photoURL: '';
		nombre: '';
		apellidos: '';
		email: '';
		role: undefined;
		size: 'md';
		showRelaseBadge: false;
		showStatusBadge: false;
		isActive: true;
		showBorder: false
		customColor: undefined;
	});

	const imageError = ref(false);

	const initials = computed(()=>{
		 if(props.nombre && props.apellidos){
		 	return `${props.nombre.charAt(0)} ${props.apellidos.charAt(0)}.toUperCase()`;
		 }

		 if(props.nombre){
		 	 return props.nombre.substring(0,2).toUpperCase();
		 }

		 if(props.apellidos){
		 	return props.apellidos.substring(0,2).toUpperCase();
		 }

		 return 'U';
	});

	const altText = computed(()=>{
		if(props.nombre && props.apellidos){
			return `${props.nombre} ${props.apellidos}`;
		}

		if(props.email){
			return props.email;
		}

		return 'Usuario';
	});

	const sizeClasses = computed(()=>{
		const sizes = {
			xs: 'w-6 h-6',
			sm: 'w-8 h-8', 
			md: 'w-10 h-10', 
			lg: 'w-12 h-12',
			xl: 'w-16 h-16',
			'2xl': 'w-20 h-20',
		};
		 return sizes[props.size];
	});
</script>