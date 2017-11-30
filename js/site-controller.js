app.controller('siteController', ['$scope', '$window', function($scope, $window) {
	var self = this;

	self.time = null;
	self.ltc = 0;
	self.eth = 0;
    self.totalValue = 0;
    self.totalProfit = 0;

	self.coins = [
		{
			id: 'LTC',
			amount: 8.99953501,
			spent: 537.27,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null
		},
		{
			id: 'ETH',
			amount: 0.31983068,
			spent: 159,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null
		},
		{
			id: 'XRP',
			amount: 144.855,
			spent: 50,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null
		},
		{
			id: 'BTC',
			amount: 0,
			spent: 0,
			currentPricePerCoinUSD: 0,
			currentPricePerCoin: 0,
			currentValue: 0,
			currentProfit: 0,
			currentPercentage: null
		}
	];

	var perMins = 1;
	var runEveryMin = 60 * 1000;

	init();

	function init() {
	    keepRunning();
	}

	function loadLTC() {
		$window.fetch('https://api.coinmarketcap.com/v1/ticker/litecoin/?convert=CAD')
		.then(function(res) { 
			return res.json(); 
		}).then(function(data) { 
			$scope.$apply(function() {
				var ltc = data[0];
				self.ltc = ltc.price_cad;

				UpdateData(ltc);
			});
		});
	}

	function loadETH() {
		$window.fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=CAD')
		.then(function(res) { 
			return res.json(); 
		}).then(function(data) { 
			$scope.$apply(function() {
				var eth = data[0];
				self.eth = eth.price_cad;

				UpdateData(eth);
			});
		});
	}

	function loadBTC() {
		$window.fetch('https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=CAD')
		.then(function(res) { 
			return res.json(); 
		}).then(function(data) { 
			$scope.$apply(function() {
				var btc = data[0];
				self.btc = btc.price_cad;
				UpdateData(btc);
			});
		});
	}

	function loadXRP() {
		$window.fetch('https://api.coinmarketcap.com/v1/ticker/ripple/?convert=CAD')
		.then(function(res) { 
			return res.json(); 
		}).then(function(data) { 
			$scope.$apply(function() {
				UpdateData(data[0]);
			});
		});
	}

	function UpdateData(coin) {
		for(var i = 0; i < self.coins.length; i++) {
			if (coin.symbol == self.coins[i].id) {
				self.coins[i].currentPricePerCoinUSD = coin.price_usd;
				self.coins[i].currentPricePerCoin = coin.price_cad;
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
	    loadLTC();
	    loadETH();
	    loadBTC();
	    loadXRP();

		setTimeout(keepRunning, runEveryMin);
	}
}]);