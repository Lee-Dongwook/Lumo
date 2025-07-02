from ai.supa.client import supabase

def insert_test_user():
    data= {
        "email":"test@test.com",
        "name": "Test"
    }
    res = supabase.table('users').insert(data).execute()
    print('Inserted: ',res.data)

if __name__ == "__main__":
    insert_test_user()