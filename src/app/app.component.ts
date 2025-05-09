import { Component } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeModel } from './model/Employee';


@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeForm: FormGroup=new FormGroup({}); 
  empList:EmployeeModel[]=[];
  isEdit=false;

  constructor() {
    debugger;
    this.createForm(); // Corrected function name and call
    const oldData=localStorage.getItem("EmpData");
    if(oldData!=null){
      const parseData=JSON.parse(oldData);
      this.empList=parseData;
  
    }
  }

  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name),
      city: new FormControl(this.employeeObj.city),
      address: new FormControl(this.employeeObj.address),
      contactNo: new FormControl(this.employeeObj.contactNo), // property name fix
      emailId: new FormControl(this.employeeObj.emailId),
      state: new FormControl(this.employeeObj.state),
      pinCode: new FormControl(this.employeeObj.pinCode) // optional field
    });
  }

  onSave(){
    debugger;

    const formData = this.employeeForm.value;

    // 🔍 Check for duplicate by emailId or contactNo
    const isDuplicate = this.empList.some(emp =>
      emp.emailId === formData.emailId || emp.contactNo === formData.contactNo
    );
  
    if (isDuplicate) {
      alert("Employee with same Email or Contact No already exists.");
      return; //  Stop saving //Exit
    }
    

  const oldData=localStorage.getItem("EmpData");
  if(oldData!=null){
    const parseData=JSON.parse(oldData);
    this.employeeForm.controls["empId"].setValue(parseData.length+1);
    this.empList.unshift(this.employeeForm.value);

  }
  else{
    this.empList.unshift(this.employeeForm.value);
  }
  localStorage.setItem("EmpData",JSON.stringify(this.empList));

  this.employeeForm.reset({
    empId: null,
    name: '',
    city: '',
    address: '',
    contactNo: '',
    emailId: '',
    state: '',
    pinCode: ''
  });

  }

  onEdit(item:EmployeeModel){
    // this.employeeObj=item;
    // this.createForm();
    this.employeeForm.patchValue(item);
    this.isEdit=true;

  }


  onUpdate() {
    const updatedData = this.employeeForm.value;

    //  Find index using empId
    const index = this.empList.findIndex(emp => emp.empId === updatedData.empId);
    if (index !== -1) {
      this.empList[index] = updatedData;
      localStorage.setItem("EmpData", JSON.stringify(this.empList));
      this.employeeForm.reset();
      this.isEdit = false;
    }
  }

  onDelete(empId: number) {
    this.empList = this.empList.filter(emp => emp.empId !== empId);
    localStorage.setItem("EmpData", JSON.stringify(this.empList));
  }

}
