app.controller('siteController', ['$scope', '$window', function($scope, $window) {
	var self = this;

	self.time = null;
	self.ltc = 0;
	self.eth = 0;

	self.total = {
		spent: 0,
		value: 0,
		profit: 0,
		profitPercentage: 0
	};

    self.totalValue = 0;
    self.totalProfit = 0;
    self.displayPercentChange = false;

	self.coins = [
		{
			id: 'LTC',
			name: 'Litecoin',
			amount: 8.99953501,
			spent: 537.27,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentPricePerCoinCB: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		},
		{
			id: 'ETH',
			name: 'Ethereum',
			amount: 0.31983068,
			spent: 159,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentPricePerCoinCB: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		},
		{
			id: 'MIOTA',
			name: 'IOTA',
			amount: 10.989,
			spent: 50,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentPricePerCoinCB: null,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		},
		{
			id: 'XLM',
			name: 'Stellar Lumens',
			amount: 272.59550396,
			spent: 65,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentPricePerCoinCB: null,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		},
		{
			id: 'XRP',
			name: 'Ripple',
			amount: 144.855,
			spent: 50,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentPricePerCoinCB: null,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		},
		{
			id: 'SNT',
			name: 'Status',
			amount: 242.52,
			spent: 25,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentPricePerCoinCB: null,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		}
		//,
		// {
		// 	id: 'BTC',
		// 	name: 'Bitcoin',
		// 	amount: 0,
		// 	spent: 0,
		// 	currentPricePerCoinUSD: 0,
		// 	currentPricePerCoin: 0,
		// 	currentValue: 0,
		// 	currentProfit: 0,
		// 	currentPercentage: null,
		// 	percentageChanges: null
		// }
	];

	var perMins = 1;
	var runEveryMin = 60 * 1000;

	init();

	function init() {
		for(var i = 0; i < self.coins.length; i++) {
			self.total.spent += self.coins[i].spent;
		}

		keepRunning();
	}

	function loadCoinbaseApiData(coinID) {
		$window.fetch('https://api.coinbase.com/v2/prices/' + coinID + '-CAD/sell')
		.then(function(res) { 
			return res.json(); 
		}).then(function(data) { 
			var coin = data.data;
			console.log()

			for(var i = 0; i < self.coins.length; i++) {
				if (coin.base == self.coins[i].id) {
					self.coins[i].currentPricePerCoinCB = coin.amount;
				}
			}
		});
	}

	function loadCoinMarketcapApiData(coinID, coin) {
		$window.fetch('https://api.coinmarketcap.com/v1/ticker/' + coinID + '/?convert=CAD')
		.then(function(res) { 
			return res.json(); 
		}).then(function(data) { 
			$scope.$apply(function() {
				if (coin) {
					self[coin] = data[0].price_cad;
				}

				UpdateData(data[0]);
			});
		});
	}

	function UpdateData(coin) {
		for(var i = 0; i < self.coins.length; i++) {
			if (coin.symbol == self.coins[i].id) {
				self.coins[i].currentPricePerCoinUSD = coin.price_usd;
				self.coins[i].currentPricePerCoin = coin.price_cad;
				self.coins[i].percentageChange1Hour = ('(' + coin.percent_change_1h + '%, ' + coin.percent_change_24h + '%, ' + coin.percent_change_7d + '%)');
				self.coins[i].currentValue = (self.coins[i].amount * self.coins[i].currentPricePerCoin);
				self.coins[i].currentProfit = (self.coins[i].currentValue - self.coins[i].spent);

				if (self.coins[i].currentValue > 0) {
					var percentage = (self.coins[i].currentValue / self.coins[i].spent) - 1;
					percentage = Math.round(percentage * 10000) / 100;

					if (percentage > 0) {
						self.coins[i].currentPercentage = '+' + percentage + '%';
					} else {
						self.coins[i].currentPercentage = percentage + '%';
					}
				}

		    	self.total.value += self.coins[i].currentValue;
		    	self.total.profit += self.coins[i].currentProfit;

				var tempPercentage = (self.total.value - self.total.spent);
				tempPercentage = Math.round(tempPercentage / self.total.spent * 10000) / 100
				if (tempPercentage > 0) {
					tempPercentage = '+' + tempPercentage + '%';
				} else {
					tempPercentage = tempPercentage + '%';
				}
				self.total.profitPercentage = tempPercentage;
			}
		}
	}

	function keepRunning() {
	    self.total.value = 0;
	    self.total.profit = 0;

		self.time = Date.now();
		loadCoinMarketcapApiData('litecoin', 'ltc');
		loadCoinMarketcapApiData('ethereum', 'eth');
		// loadCoinMarketcapApiData('bitcoin');
		loadCoinMarketcapApiData('ripple');
		loadCoinMarketcapApiData('iota');
		loadCoinMarketcapApiData('stellar');
		loadCoinMarketcapApiData('status');

		// loadCoinbaseApiData('LTC');
		// loadCoinbaseApiData('ETH');
		// loadCoinbaseApiData('BTC');

		setTimeout(keepRunning, runEveryMin);
	}
}]);