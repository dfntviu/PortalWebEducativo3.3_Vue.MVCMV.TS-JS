 ## README  Diagnostico avanzado: Regex, Snippets y falsa hipotesis de "basura temporal" ##
   - Contexto del problema
   Durante la depuracion de errores de compilación CSS en un componente .vue, se observó un
   comportamiento aparentemente anomalo: el compilador (PostCSS) señalaba errores en líneas validas y el
   cursor(^) parecía desplazarse línea por línea conforme se corregía el código. Este fenómeno llevó a 
   formular varias hipotesis tecnicas, incluyendo la presencia de caracteres invisibles, residuos de 
   memoria o "basura temporal" persistente al archivo.

   - Uso de expresiones regulares(Regex)
   Se intentó detectar caracteres invisibles mediante búsquedas con expresiones regulares, con rangos 
   fuera de ASCII o patrones de espacios no estandár. En este editor Sublime T., estás busquedas resaltaban
   bloques completos en azul, lo que inicialmente se interpreto como evidencia de contaminacion de archivo.
   Sin embargo, el reslatado indicaba solo coincidencias con el patron utilizado(tabulaciones o identacion),
   no errores reales.

   Las expresiones regulares eran correctas desde el punto de vista sintactico, pero demasiado generales
   para aislar el problema. No se detectaron caracteres invisibles relevantes que justifican el fallo del 
   compilador.

   - SNIPPETS Y RESCRITURA MANUAL
   Se aplicó la técnica clasica de rescritura quirurgíca: borrar líneas completas y rescribirlas manualmente,
   evitando copiar y pegar. Este enfoque es históricamente efectivo cuando existen bytes invisibles persistentes.
   Aunque el error parecia desplazarse tras cada correcion, este comportamiento no confirmaba la existencia de
   caracteres ocultos, sino que no respondía a la forma en la que el parser reportaba el fallo.

   Conclusion:
   Los snippets y la rescritura manual no solucionaban el problema origen porque el origen no era un caracter
   invalido, sino un error semantico posterior.

   - Conclusion
   El problema no estaba relacionado con expresiones regulares, el codigo, ni residuos de memoria. 
   El desplazamiento del error era consecuencia directa de un valor CSS invalido que rompía el parseo,
   provocando que el compilador apuntara a tokens previamente validos. Las herramientas de busqueda y
   rescritura fueron útiles como proceso de descarte, pero no como solución directa.
   *Se recomienda que, cuando se seniala una linea correcta y el error "se mueve" al corregirla, es fundamental
   revisar la propiedad inmediatamente posterior y validar sematicamente sus valores antes de asumir
   que el archivo este deprecado o corrupto o estado interno del compilador.*