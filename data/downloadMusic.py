#!/usr/bin/env python
# A python project to download a song or a list of songs.
# created by Aman Roy
# Creation Date : 18-Feb-2016
# Python version used : - Python 3.4.3+ (ported for python2)
# Please use right spelling to avoid errors
# All licence belongs to authour.

# Please import all the library used
import re, urllib, os, sys, argparse,time
import csv

csvdata = []

# determine python version
version = sys.version_info[0]

# set user_input and import modules for correct version of python
if version == 2:  # python 2.x
    user_input = raw_input
    import urllib2
    urlopen = urllib2.urlopen  # open a url
    encode = urllib.urlencode  # encode a search line
    retrieve = urllib.urlretrieve  # retrieve url info
    cleanup = urllib.urlcleanup()  # cleanup url cache

else:  # python 3.x
    user_input = input
    import urllib.request
    import urllib.parse
    urlopen = urllib.request.urlopen
    encode = urllib.parse.urlencode
    retrieve = urllib.request.urlretrieve
    cleanup = urllib.request.urlcleanup()



# clear the terminal screen
def screen_clear():
    if os.name == 'nt':
        os.system('cls')
    else:
        os.system('clear')


# function to retrieve video title from provided link
def video_title(url):
    try:
        webpage = urlopen(url).read()
        title = str(webpage).split('<title>')[1].split('</title>')[0]
    except:
        title = 'Youtube Song'

    return title

# the introduction of the Author 
def intro():
    print('''Created by Aman Roy
    github:- http://github.com/aman-roy
    Email:- royaman8757@gmail.com''')


# find out what the user wants to do
def prompt():
    # user prompt to ask mode
    print ('''\t\t\t Select A mode
    [1] Download from a list
    [2] Download from direct entry
    Press any other key from keyboard to exit''')

    choice = user_input('>>> ')
    return str(choice)


# download from a list of songs or links
def list_download(song_list=None):
    if not song_list:
        song_list = user_input('fileName(with extension): ')  # get the file name to be opened
    # find the file and set fhand as handler
    try:
        fhand = open(song_list, 'r')
    except IOError:
        print('File does not exist')
        exit(1)

    # Iterating over the lines in file
    for song in fhand:
        single_download(song)

    fhand.close()


# download directly with a song name or link
def single_download(song=None, id=None):
    if not(song):
        song = user_input('Enter the song name or youtube link: ')  # get the song name from user
    if not(id):
        exit(1)
    if "youtube.com/" not in song:
        # try to get the search result and exit upon error
        try:
            print("song - "+song)
            query_string = encode({"search_query" : song})
            html_content = urlopen("http://www.youtube.com/results?" + query_string)

            if version == 3:  # if using python 3.x
                search_results = re.findall(r"watch\?v=(\S{11})", html_content.read().decode())
                print(search_results[0])
            else:  # if using python 2.x
                search_results = re.findall(r"watch\?v=(\S{11})", html_content.read())
        except:
            print('Network Error')
            return None
        if len(search_results) == 0:
            print('No search results found')
            exit(1)
        # make command that will be later executed
        command = f'youtube-dl --no-warnings --extract-audio --audio-format mp3 -o "/data/musicData/{id}.%(ext)s" ' + search_results[0]
        
    else:      # For a link
        # make command that will be later executed
        command = f'youtube-dl --no-warnings --extract-audio --audio-format mp3 -o "/data/musicData/{id}.%(ext)s" ' + song[song.find("=")+1:]
        song=video_title(song)

    try:       # Try downloading song
        print('Downloading %s' % song)
        os.system(command)
    except:
        print('Error downloading %s' % song)
        return None

# program exit
def exit(code):
    print('\nExiting....')
    print('\nHave a good day.')
    sys.exit(code)


# main guts of the program
def main():
	# Check for any flags first
    loc = open(r'C:\Users\Vidhi\Desktop\music app backend\data\music.csv', encoding='utf8')
    reader = csv.reader(x.replace('\0', '') for x in loc)
    for line in reader:
        arr=[]
        for i in line:
            arr.append(i)
        csvdata.append(arr)
    #print(csvdata[1])
    for i in range(301, len(csvdata)):
        print("Downloading song id... "+csvdata[i][0])
        single_download(csvdata[i][7]+" "+csvdata[i][8], csvdata[i][0])
    #single_download(csvdata[1][7], csvdata[1][0])
    # ap = argparse.ArgumentParser()
    # ap.add_argument('-s', '--single', help='for single song download.')
    # ap.add_argument('-l', '--list', help='for list of song download')
    # args = vars(ap.parse_args())
    # if args['single'] or args['list']:
    #     if args['single']:
    #         single_download(args['single'])
    #     else:
    #         list_download(args['list'])
    # else:
    #     try:
    #         screen_clear()
    #         intro()
    #         choice = prompt()

    #         try:
    #             if choice == '1':
    #                 list_download()
    #             elif choice == '2':
    #                 single_download()
    #         except NameError:
    #             exit(1)
    #     except KeyboardInterrupt:
    #         exit(1)
    #     exit(1)

if __name__ == '__main__':
    main()  # run the main program
    exit(0)  # exit the program