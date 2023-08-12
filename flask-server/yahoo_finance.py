import pandas as pd
import yfinance as yf


def fetch_yahoo_finance_market_chart(coin_code: str,
                                     vs_currency: str,
                                     period: str = '5y') -> pd.DataFrame:
    df = yf.Ticker(f'{coin_code}-{vs_currency}').history(period=period,
                                                         interval='1d',  
                                                         prepost=False,  
                                                         repair=False,   
                                                         keepna=True,    
                                                         timeout=None,   
                                                         raise_errors=True)

    # Returns pd.DataFrame with columns:
    #   ['Open', 'High', 'Low', 'Close', 'Volume', 'Dividends', 'Stock Splits']
    # 'Dividends' and 'Stock Splits' aren't useful (all 0s in df.describe())
    df.drop(columns=['Dividends', 'Stock Splits'], inplace=True)

    return df
