# LinkCom-Frontend

Si quiere comprobar que el front se conecta correctamente con el backend debajo de la línea:
```typescript
title = 'LinkCom-FrontEnd';
```

Añadir:
```typescript
  data : any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: (response : any) => {
        console.log('Respuesta recibida:', response);  
      },
      error: (erro:any) => {
        console.log('Respuesta recibida:', erro);  
      }
    });
  }
```

Posteriormente, ejecutar el comando y visualizar la consola del navegador

```bash
ng serve
```