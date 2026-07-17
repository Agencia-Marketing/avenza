# Guia para cliente: editar el blog de Avenza

Esta guia explica como entrar al CMS, crear articulos, editar contenido y publicar cambios en el sitio.

## Acceso

URL del editor:

```txt
https://avenzafinancial.com/admin
```

Para entrar necesitas una cuenta de GitHub autorizada por el equipo tecnico.

## Iniciar sesion

1. Abre `https://avenzafinancial.com/admin`.
2. Haz clic en `Sign In with GitHub`.
3. Inicia sesion con tu cuenta de GitHub.
4. Si GitHub pide autorizar `Avenza CMS`, acepta.
5. Al terminar, volveras al editor del sitio.

No uses access tokens. El acceso correcto para cliente es con `Sign In with GitHub`.

## Crear un articulo

1. Entra al CMS.
2. Selecciona la coleccion del blog:
   - `Blog (Espanol)` para articulos en espanol.
   - `Blog (English)` para articulos en ingles.
3. Haz clic en `New`.
4. Completa los campos:
   - `Titulo` / `Title`: nombre del articulo.
   - `Descripcion` / `Description`: resumen corto.
   - `Fecha` / `Date`: fecha de publicacion.
   - `Imagen de portada` / `Cover image`: imagen principal, si aplica.
   - `Etiquetas` / `Tags`: palabras clave.
   - `Borrador` / `Draft`: activar si no debe publicarse todavia.
   - `Contenido` / `Content`: cuerpo del articulo.
5. Guarda el articulo.

## Editar un articulo existente

1. Entra al CMS.
2. Abre la coleccion correspondiente: espanol o ingles.
3. Selecciona el articulo.
4. Edita el contenido necesario.
5. Guarda los cambios.

## Publicar o dejar en borrador

Usa el campo `Borrador` / `Draft`:

- Desactivado: el articulo queda publicado.
- Activado: el articulo queda guardado como borrador y no deberia mostrarse como articulo publicado.

## Imagenes

Puedes subir imagenes desde el campo de portada o desde el editor, segun el tipo de campo disponible.

Recomendaciones:

- Usa imagenes livianas.
- Evita nombres con caracteres raros.
- Usa nombres descriptivos, por ejemplo:

```txt
guia-impuestos-empresa.jpg
```

## Despues de guardar

Cuando guardas un cambio, el CMS lo envia al repositorio del sitio. El sitio puede tardar unos minutos en actualizarse publicamente.

Flujo normal:

```txt
Guardar en CMS -> GitHub recibe el cambio -> Cloudflare despliega -> Sitio actualizado
```

## Problemas comunes

### No puedo entrar

Confirma que estas usando la cuenta de GitHub autorizada. Si sigues sin poder entrar, contacta al equipo tecnico.

### Puedo entrar, pero no puedo guardar

Puede faltar permiso de escritura en GitHub o aprobacion de la app `Avenza CMS` en la organizacion. Contacta al equipo tecnico y envia una captura del error.

### Guarde un articulo, pero no aparece en el sitio

Espera unos minutos. Si sigue sin aparecer:

- Revisa que `Borrador` / `Draft` este desactivado.
- Confirma que editaste el idioma correcto.
- Contacta al equipo tecnico.

### Subi una imagen y no se ve

Revisa que la imagen haya terminado de cargarse antes de guardar. Si el problema continua, contacta al equipo tecnico.

## Buenas practicas de contenido

- Escribe titulos claros y cortos.
- Usa una descripcion breve para cada articulo.
- Revisa ortografia antes de guardar.
- No pegues contenido con formato raro desde Word; si algo se ve mal, pegalo como texto plano.
- Sube imagenes optimizadas para web.

## Soporte

Cuando reportes un problema, envia:

- URL donde ocurrio el problema.
- Captura de pantalla.
- Nombre del articulo.
- Hora aproximada del intento.
- Mensaje de error exacto, si aparece.
