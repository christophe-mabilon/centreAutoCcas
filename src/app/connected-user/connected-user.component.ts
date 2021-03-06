import {Component, OnDestroy, OnInit} from "@angular/core";
import {MarqueService} from "../shared/services/marque.service";
import {RegionService} from "../shared/services/region.service";
import {Region} from "../shared/interface/region.interface";
import {BehaviorSubject, Subscription} from "rxjs";
import {Marque} from "../shared/interface/marque.interface";
import {UserService} from "../shared/services/user.service";
import {AnnoncesService} from "../shared/services/annonces.service";
import {GarageService} from "../shared/services/garage.service";

@Component({
  selector: "app-connected-user",
  templateUrl: "./connected-user.component.html",
  styleUrls: ["./connected-user.component.scss"],
})
export class ConnectedUserComponent implements OnInit, OnDestroy {
  subs: Subscription = new Subscription();

  userDetails!: any[];
  regions!: BehaviorSubject<Region[]>;

  marques!: BehaviorSubject<Marque[]>;
  tabAnnoncetemp:any= {};
  tabGaragetemp:any= {};
  constructor(private annoncesServ: AnnoncesService, private garageServ: GarageService, private marqueServ: MarqueService, private regionserv: RegionService, private userServ: UserService) {
  }


  ngOnInit(): void {
    this.subs.add(this.userServ.getCurentUser().subscribe(data=>{
      this.userDetails = Array.of(data);
    }));
    if (localStorage.getItem('isLogged')){
      this.regions = this.regionserv.regions;
      this.marques = this.marqueServ.marques;
      this.subs.add(this.userServ.getCurentUser().subscribe(data => {
        localStorage.setItem("userId", data.id);
        let i = 1
        for (let garage of data.garages) {
            this.tabGaragetemp[i] = {"garage": garage.id};
          localStorage.setItem("garage",JSON.stringify(this.tabGaragetemp));
          i=i+1;
        }
        let j = 0;
        for (let annonce of data.ClassifiedAd) {
          this.tabAnnoncetemp[j] = {"id": annonce.id,"annonceRef":annonce.reference};
        localStorage.setItem("annonces", JSON.stringify(this.tabAnnoncetemp));
        j++;

      }
      }));
    }
  }
  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }

}
