---
---
$( document ).ready(function() {

    //Using twitterfetcher_min.js to grab tweets from username
    if ($('.twitter-feature').length > 0) {
        console.log("getting tweets")
        
        function populateTpl(tweets){

            var last_tweet = document.getElementById('last_tweet');
            var last_tweet_time = document.getElementById('last_tweet_time');
            last_tweet.innerHTML = tweets[0].tweet;
            last_tweet_time.innerHTML = tweets[0].time;
            //console.log(tweets[0]);
        }

        var config = {
          "profile": {"screenName": '{{ site.social.twitter.username }}'},
          "dataOnly": true,
          "customCallback": populateTpl
        };

        twitterFetcher.fetch(config);
    }
    
    //Show twitch embedded player if livestream is active
    if ($('.twitch-feature').length > 0) {
        console.log('twitch')
        $.getJSON('https://api.twitch.tv/kraken/streams/{{ site.social.twitch.username }}', function(channel) {

            var stream_status = document.getElementById('twitch_stream_status')

            if (channel["stream"] == null) { 
                stream_status.innerHTML = 'Stream is offline'

            } else {
                
                //adjust liquid variable to true/false
                {% if site.social.twitch.auto_play_video == 1 %}
                    {% assign twitch_video_autoplay = 'true' %}
                {% else %}
                    {% assign twitch_video_autoplay = 'false' %}
                {% endif %}
                
                stream_status.innerHTML = '<iframe \
                src="http://player.twitch.tv/?channel={{ site.social.twitch.username }}" \
                height="300" \
                width="400" \
                frameborder="0" \
                scrolling="no" \
                autoplay={{ twitch_video_autoplay }} \
                allowfullscreen="true"> \
                </iframe>'
            }
        });
    }
    
    //Show github activity
    if ($('.github-feature').length > 0) {
        console.log('github')
        $.getJSON('https://api.github.com/users/{{ site.social.github.username}}/events', function(github_data) {

            gh = document.getElementById('github_activity');

            gh.innerHTML = 'last acitivty ' + moment(github_data[0].created_at).fromNow();

        });
    }
    
    //Show reddit comments
    if ($('.reddit-feature').length > 0) {
      reddit_comment_list = $("#reddit_comment_list")
      console.log("reddit")
      $.getJSON(
        "http://reddit.com/u/{{site.social.reddit.username}}.json?limit=3&jsonp=?",
        function foo(data)
        {
          $.each(
            data.data.children.slice(0, 3),
            function (i, post) {
                
                //holy shit this is bad and i'm ashamed, but it works so i'll clean it up later
                if ('title' in post.data) {
                    reddit_comment_list.append("<li>" + post.data.score +  " - <a target=\"_blank\" class=\"hide_url_color\" href=\"https://reddit.com" + post.data.permalink + "\">"  + post.data.title + "</a> <b>in</b> <a target=\"_blank\" href=\"https://reddit.com/r/" + post.data.subreddit+ "\">/r/" + post.data.subreddit + "</a> " + " " + moment.unix(post.data.created_utc).fromNow() +"</li>");
                } else {
                    //Must be a comment then
                    reddit_comment_list.append("<li>" + post.data.score + " - <a href=\"https://reddit.com/u/{{site.social.reddit.username}}\" target=\"_blank\" class=\"hide_url_color\">" + post.data.body + "</a> <b>in</b> <a target=\"_blank\"  href=\"https://reddit.com/r/" + post.data.subreddit+ "\">/r/" + post.data.subreddit + "</a> " + " " + moment.unix(post.data.created_utc).fromNow() +"</li>");
                }
            });
        });
    }
});

