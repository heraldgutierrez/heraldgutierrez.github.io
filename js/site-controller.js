app.controller('siteController', ['$scope', '$window', function($scope, $window) {
	var self = this;

	self.time = null;
	self.ltc = 0;
	self.eth = 0;
    self.totalValue = 0;
    self.totalProfit = 0;
    self.displayPercentChange = false;

	self.coins = [
		{
			id: 'LTC',
			amount: 8.99953501,
			spent: 537.27,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		},
		{
			id: 'ETH',
			amount: 0.31983068,
			spent: 159,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		},
		{
			id: 'MIOTA',
			amount: 10.989,
			spent: 50,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		},
		{
			id: 'XLM',
			amount: 272.59550396,
			spent: 65,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		},
		{
			id: 'XRP',
			amount: 144.855,
			spent: 50,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null,
			percentageChanges: null
		}
		// {
		// 	id: 'BTC',
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
	    keepRunning();
	}

	function loadApiData(coinID, coin) {
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

		    	self.totalValue += self.coins[i].currentValue;
		    	self.totalProfit += self.coins[i].currentProfit;
			}
		}
	}

	function keepRunning() {
	    self.totalValue = 0;
	    self.totalProfit = 0;

		self.time = Date.now();
		loadApiData('litecoin', 'ltc');
		loadApiData('ethereum', 'eth');
		//loadApiData('bitcoin');
		loadApiData('ripple');
		loadApiData('iota');
		loadApiData('stellar');

		setTimeout(keepRunning, runEveryMin);
	}
}]);