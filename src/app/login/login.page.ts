import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AndroidFingerprintAuth } from "@ionic-native/android-fingerprint-auth/ngx";
import { AlertController, NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
	selector: "app-login",
	templateUrl: "./login.page.html",
	styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
	public loginForm: FormGroup;

	private user = {
		username: "admin",
		password: "123"
	};

	constructor(
		private formBuilder: FormBuilder,
		private navCtrl: NavController,
		private alertController: AlertController,
		private storage: Storage,
		private androidFingerprintAuth: AndroidFingerprintAuth
	) {
		this.loginForm = this.formBuilder.group({
			username: [""],
			password: [""]
		});
	}

	ngOnInit() {}

	login() {
		if (this.loginForm.value.username === this.user.username) {
			if (this.loginForm.value.password == this.user.password) {
				this.loginSuccess();
			} else {
				this.incorrectPassword();
			}
		} else {
			this.userNotFound();
		}
	}

	async userNotFound() {
		const alert = await this.alertController.create({
			header: "User not found!",
			buttons: ["OK"]
		});

		await alert.present();
	}

	async incorrectPassword() {
		const alert = await this.alertController.create({
			header: "Incorrect Password",
			buttons: ["OK"]
		});

		await alert.present();
	}

	loginSuccess() {
		this.storage.set("user", this.loginForm.value.username);

		this.checkFingerprint();
	}

	checkFingerprint() {
		this.storage.get(this.loginForm.value.username).then(userFinger => {
			if (userFinger == null) {
				this.registerFinger();
			} else {
				this.openHome();
			}
		});
	}

	async registerFinger() {
		const alert = await this.alertController.create({
			header: "Do you want to register your fingerprint?",
			buttons: [
				{
					text: "No",
					role: "cancel",
					handler: () => {
						this.openHome();
					}
				},
				{
					text: "Yes",
					handler: () => {
						this.resgisterFingerprint();
						console.log("Buy clicked");
					}
				}
			]
		});
		await alert.present();
	}

	openHome() {
		this.navCtrl.navigateRoot("home");
	}

	resgisterFingerprint() {
		this.androidFingerprintAuth
			.isAvailable()
			.then(result => {
				if (result.isAvailable) {
					// it is available

					this.androidFingerprintAuth
						.encrypt({
							clientId: "myAppName",
							username: this.loginForm.value.username,
							password: this.loginForm.value.password
						})
						.then(result => {
							if (result.withFingerprint) {
								console.log("Successfully encrypted credentials.");
								console.log("Encrypted credentials: " + result.token);
								this.storage.set(this.loginForm.value.username, {
									token: result.token,
									activated: true
								});
								this.openHome();
							} else if (result.withBackup) {
								console.log("Successfully authenticated with backup password!");
							} else console.log("Didn't authenticate!");
						})
						.catch(error => {
							if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
								console.log("Fingerprint authentication cancelled");
							} else console.error(error);
						});
				} else {
					// fingerprint auth isn't available
				}
			})
			.catch(error => console.error(error));
	}

	decryptPass(token) {
		this.androidFingerprintAuth.isAvailable().then(result => {
			if (result.isAvailable) {
				this.androidFingerprintAuth
					.decrypt({
						clientId: "myAppName",
						username: this.loginForm.value.username,
						token: token
					})
					.then(result => {
						console.log("decrypt result", result);
						if (result.password) {
							console.log("Successfully decrypted credential token.");
							console.log("password: " + result.password);
							this.openHome();
						}
					})
					.catch(error => {
						console.log("FingerprintAuth Error: " + error);
					});
			}
		});
	}

	checkHasFinger() {
		this.storage.get(this.loginForm.value.username).then(user => {
			console.log("user", user);
			if (user != null) {
				if (user.activated == true) {
					this.decryptPass(user.token);
				}
			}
		});
	}
}
