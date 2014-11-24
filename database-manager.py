import argparse
from subprocess import call

# Setup argument parser
parser = argparse.ArgumentParser(description="Manage Emotion in Motion databases")
parser.add_argument('action', help='the action to perform: dump-all, import-all, or copy-dev')
args = parser.parse_args()

development_database = 'emotion-in-motion-dev'
test_database = 'emotion-in-motion-test'
production_database = 'emotion-in-motion-production'

databases = [development_database, test_database, production_database]

def dump_all_databases():

    for database in databases:
        call(['mongodump', '--port', '28017', '-d', database, '-o', './mongodb-dump'])

def import_all_databases():
    for database in databases:
        call(['mongorestore', '--port', '28017', '-d', database, '--drop', './mongodb-dump/%s' % database])

def dump_development_database():
    call(['mongodump', '--port', '28017', '-d', development_database, '-o', './mongodb-dump'])

def copy_development_to_test_and_production():
    dump_development_database()
    call(['mongorestore', '--port', '28017', '-d', test_database, '--drop', './mongodb-dump/%s' % development_database])
    call(['mongorestore', '--port', '28017', '-d', production_database, '--drop', './mongodb-dump/%s' % development_database])
    dump_all_databases()

if args.action == 'dump-all':
    dump_all_databases()
elif args.action == 'import-all':
    import_all_databases()
elif args.action == 'copy-dev':
    copy_development_to_test_and_production()
