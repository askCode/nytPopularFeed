
	var template = $('#feed-template').html();
	function getArticles(region){
		var region = region.toLowerCase();
		if (region === 'us')
			region = 'u.s.';

		$('div.article-container').empty();
		var nytFeed = {
			initialize: function(config){
				this.url = "http://api.nytimes.com/svc/mostpopular/v2/mostviewed/" + region + "/30.jsonp?" + "&api-key=f198d1f8e610958c91c24a0d2ae8403c:19:68603512";
				//this.url='http://api.nytimes.com/svc/mostpopular/v2/mostviewed/1.jsonp?offset="+20+"&api-key=f198d1f8e610958c91c24a0d2ae8403c:19:68603512';
				//this.url='http://api.espn.com/v1/sports/news/headlines/top?limit=9&apikey=n39jrj4s97tvhxym4qgacnrd&callback=?';
				//console.log('API called')
				this.template = config.template;
				this.container = config.container;
				this.fetch();

			},

			attachTemplate: function(){
				var template = Handlebars.compile(this.template);
				var articles = template(this.nytFeed);
				this.container.append(articles);
			},

			fetch: function(){

				var self = this;

				$.ajax({
					contentType: "application/jsonp",
					type: "GET",
					url: this.url,
					dataType: "jsonp",
					success: function(data){
						var results = data.results;
						console.log(results);
						self.nytFeed = $.map(results, function(article){
							return {
								abstract: article['abstract'],
								byline: article['byline'],
								title: article['title'],
								section: article['section'],
								url: article['url'],
								datePublished: article['published_date'],
								//thumbnailStandard: article.media ? article.media[0]['media-metadata'][1]['url'] : '' //need to add code to get all the pics if present
								thumbnailStandard: function(){
									var photoArrayLen = article.media.length;
									if (photoArrayLen > 0 && (article.media))
										return article.media[0]['media-metadata'][0]['url'];
									else return '';
								},
								thumbnailLarge: function(){
									var photoArrayLen = article.media.length;
									if (photoArrayLen > 1 && (article.media))
										return article.media[0]['media-metadata'][1]['url'];
									else return '';
								},
								thumbnailXL: function(){
									var photoArrayLen = article.media.length;
									if (photoArrayLen > 2 && (article.media))
										return article.media[0]['media-metadata'][2]['url'];
									else return '';
								} 

							};
						});
						console.log(self.nytFeed);
						self.attachTemplate();
						console.log(self.attachTemplate());
					},
					error: function(error){
						console.log('error: ', error);
					}
				})
				.fail(function(error){
					console.log('error: ', error);
				});
			}
		};

		nytFeed.initialize({
			template: template,
			container: $('div.article-container'),
			section: $
		});
	};

	getArticles('all-sections');