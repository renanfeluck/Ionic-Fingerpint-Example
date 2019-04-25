import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { HomePage } from "./home.page";

@NgModule({
	imports: [
		IonicStorageModule,
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: "",
				component: HomePage
			}
		])
	],
	declarations: [HomePage]
})
export class HomePageModule {}
