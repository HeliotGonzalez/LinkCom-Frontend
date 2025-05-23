import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceFactory } from '../../services/api-services/ServiceFactory.service';
import { CommunityService } from '../../../architecture/services/CommunityService';
import { EventService } from '../../../architecture/services/EventService';
import { firstValueFrom } from 'rxjs';
import { Community } from '../../../architecture/model/Community';

@Component({
  selector: 'app-stadistics',
  standalone: true,
  imports: [],
  templateUrl: './stadistics.component.html',
  styleUrl: './stadistics.component.css'
})
export class StadisticsComponent implements OnInit {
  communityID!: string;

  numberOfMembers: number = 0;
  numberOfModerators: number = 0; 
  numberOfUsers: number = 0;
  numberOfAnnouncements: number = 0;
  numberOfEvents: number = 0;
  enrollAverage: number = 0;
  community: Community | null = null;

  constructor(
    private route: ActivatedRoute,
    private serviceFactory: ServiceFactory
  ) {}

  async ngOnInit(): Promise<void> {
    this.communityID = this.route.snapshot.paramMap.get('communityId')!;
    const communityService = this.serviceFactory.get('communities') as CommunityService;
    const eventService = this.serviceFactory.get('events') as EventService;

    this.community = (await firstValueFrom(communityService.getCommunity(this.communityID))).data[0];

    const members = await firstValueFrom(communityService.getCommunityMembers(this.communityID));
    const moderators = await firstValueFrom(communityService.getCommunityModerators(this.communityID));
    this.numberOfModerators = moderators.data.length;
    this.numberOfMembers = members.data.length;
    this.numberOfUsers = this.numberOfMembers + this.numberOfModerators;

    const announcements = await firstValueFrom(communityService.getCommunityAnnouncements(this.communityID));
    this.numberOfAnnouncements = announcements.data.length;

    const events = await firstValueFrom(communityService.getCommunityEvents(this.communityID));
    this.numberOfEvents = events.data.length;

    if (events.data.length > 0) {
      let totalInscritos = 0;
      for (const ev of events.data) {
        if (typeof ev.id === 'string') {
          const users = await firstValueFrom(eventService.getMembers(ev.id));
          totalInscritos += users.data.length;
        }
      }
      this.enrollAverage = totalInscritos / events.data.length;
    }
  }
}
