import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MustMatch } from '../confirmed.validator';

//ligação com o banco de dados
import { DataService } from '../service/data.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup
  submitted = false
  data: any


  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private toastr: ToastrService
  ) { }

  createForm() {

    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      confirmPassword: ['', [Validators.required]]
    },
      {
        validator: MustMatch('password', 'confirmPassword')
      })
  }

  ngOnInit(): void {
    this.createForm()
  }

  // função que retorna todo o formulario
  get f() {
    return this.form.controls
  }

  // verifica se todas as condições do formulario são válidas, para assim envia-las para o banco de dados
  submit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }

    this.dataService.registerUser(this.form.value).subscribe(res => {
      this.data = res
      // console.log(res)

      if (this.data.status === 1) {
        console.log('ok')
        this.toastr.success(JSON.stringify(this.data.message), JSON.stringify(this.data.code), {
          timeOut: 3000,
          progressBar: true
        })
      } else {
        console.log('Não ok')
        this.toastr.error(JSON.stringify(this.data.message), JSON.stringify(this.data.code), {
          timeOut: 3000,
          progressBar: true
        })
      }

      this.submitted = false
      this.form.get('name').reset()
      this.form.get('email').reset()
      this.form.get('password').reset()
      this.form.get('confirmPassword').reset()
    })

  }

}
