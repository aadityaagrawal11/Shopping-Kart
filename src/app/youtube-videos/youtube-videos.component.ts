import { Component } from '@angular/core';

@Component({
  selector: 'app-youtube-videos',
  templateUrl: './youtube-videos.component.html',
  styleUrl: './youtube-videos.component.css'
})
export class YoutubeVideosComponent {
  videoId:any;
  thumbnailUrl:any;
  
  ngOnInit(): void {
    this.videoId = 't1l7BTDql74'; // Replace with your actual YouTube video ID
    this.thumbnailUrl = `https://img.youtube.com/vi/${this.videoId}/0.jpg`;
  
    // Replace 'video-id' with the actual YouTube video ID
    //this.loadYoutubeVideo('t1l7BTDql74');
  }

  loadYoutubeVideo() {
    const player = new YT.Player('youtube-player', {
      height: '390',
      width: '640',
      videoId: this.videoId,
      events: {
        'onReady': this.onPlayerReady,
      
      }
    });
  }

  onPlayerReady(event:any) {
    event.target.playVideo();
  }
}
