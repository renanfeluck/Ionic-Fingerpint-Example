import { Component } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
	selector: "app-home",
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"]
})
export class HomePage {
	fingerStatus: any;
	userFingerInfo;
	user;

	constructor(private navCtrl: NavController, private storage: Storage) {}

	ionViewWillEnter() {
		this.storage.get("user").then(res => {
			this.user = res;
			console.log("user", res);
			this.storage.get(res).then(fingerRes => {
				this.userFingerInfo = fingerRes;
				console.log("fingerRes", fingerRes);
				this.fingerStatus = fingerRes.activated;
				console.log("fingerRes.activated", fingerRes.activated);
				console.log("FingerStatus Construtor", this.fingerStatus);
			});
		});
	}

	goLogin() {
		this.navCtrl.navigateRoot("login");
	}

	change($event) {
		console.log($event);
		console.log("FingerStatus", this.fingerStatus);
		this.storage.set(this.user, {
			token: this.userFingerInfo.token,
			activated: this.fingerStatus
		});
	}
}
