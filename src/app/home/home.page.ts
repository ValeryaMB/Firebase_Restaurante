import { BdService } from './../../Services/bd.service';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Item } from 'src/Models/item';
import { Datos } from 'src/Models/item';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'src/Services/toast.service';
import { LoadingService } from 'src/Services/loading.service';
import { CommonModule } from '@angular/common';
import { copyFileSync } from 'fs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule,FormsModule,CommonModule],
})
export class HomePage {
  private enlace:string = 'Personas';
  public Platos:Datos []=[];
  public Personas:Item[]=[];
  url1:any=null

  

  public newPlato:Datos={
    id: '',
    NombrePlato: '',
    precio:0,
    calificacion: 0,
    foto:''
  };

  public newPersona:Item={
    cedula: '',
    nombre: '',
    apellido: '',
    id: ''
  };
  constructor(private bd:BdService, private toast:ToastService, private load:LoadingService) {
  }
  ngOnInit() {
    this.bd.get<Datos>(this.enlace).subscribe(p=>{
      this.Platos=p;
    });
  }
  save(){
    this.load.presentLoading();
    this.newPlato.id=this.bd.createId(this.enlace);
    const data = this.newPlato;
    this.bd.add<Datos>(data,this.enlace,this.newPlato.id).then(()=>{
      this.toast.showToast("Exito al guardar","success","checkbox-outline");
      this.load.dismissLoading();
      this.clean();
    }).catch(()=>{
      this.toast.showToast("Error al guardar","danger","sad-outline");
    });
  }

  delete(p:Datos){
    this.load.presentLoading();
    this.bd.delete(`Personas`,p.id).then(()=>{
      this.toast.showToast("Exito al Borrar","success","trash-outline");
      this.load.dismissLoading();
    }).catch(()=>{
      this.toast.showToast("Error al Borrar","danger","sad-outline");
    });

  }
  imag(event:any){
    if(event.target.files && event.target.files[0] ){
      const reader= new FileReader();
      reader.onload=(e:any)=>{
        this.url1=e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      const fileName = new Date().getTime() + '.jpeg';      
    }
    else{
      this.url1=null;
    }
  }

  clean(){
    this.newPlato.id="";
    this.newPlato.NombrePlato="";
    this.newPlato.calificacion=0;
    this.newPlato.precio=0;
    this.newPlato.foto='';
    this.url1=null;
    }

  }


