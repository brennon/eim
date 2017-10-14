import sys
import numpy as np
import scipy as sp
import matplotlib.pyplot as plt
import pandas as pd
import Pypsy as pypsy
import Pypsy.signal.filter
import os.path

def plotEiMData(datafilename, savefigpath):
	# read .txt file into dataframe as columns
	print(datafilename)
	print(savefigpath)
	a=pd.read_table(datafilename, sep=" ")

	# define EDA signal
	eda_signal = pypsy.signal.EDASignal(time=a.timestamp, data=a.EDA, collapse_timestamps=True, collapse_method='mean')
	
	# filter EDA signal
	lp_filter = pypsy.signal.filter.lowpass_filter(0.5, 5.0, 50.)
	eda_signal.data = sp.ndimage.convolve1d(eda_signal.data, lp_filter)

	# define HR signal
	hr_signal = pypsy.signal.EDASignal(time=a.timestamp, data=a.HR, collapse_timestamps=True, collapse_method='mean')

	# plot the figures
	fig = plt.figure(figsize=(10,4))
	ax1 = fig.add_subplot(111)
	ax1.plot(hr_signal.time, hr_signal.data, 'r', label='Heart Rate')
	ax2 = ax1.twinx()
	ax2.plot(eda_signal.time, eda_signal.data, 'b', label='Tonic Electrodermal Activity')
	# fig.legend(loc='upper left')

	# Parse fiename to save
	original_filename = os.path.split(datafilename)[1]
	index_of_under = original_filename.rfind('_')
	filename_no_under = original_filename[0:index_of_under]
	new_filename = filename_no_under + '_results.png'
	new_file_directory = os.path.abspath(savefigpath)
	save_location = os.path.join(new_file_directory, new_filename)
	
	# save fig
	fig.savefig(save_location)

if __name__ == "__main__":
	plotEiMData(sys.argv[1], sys.argv[2]);
