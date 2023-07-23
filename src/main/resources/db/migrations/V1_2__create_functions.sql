
ALTER TABLE "users" ADD FOREIGN KEY ("client_id") REFERENCES "clients" ("id");

-- creates or replaces a stored function called insert_client
-- returns a client id
CREATE OR REPLACE FUNCTION insert_client(
  name_in varchar,
  email_in varchar,
  password_in varchar
)
 RETURNS int
 LANGUAGE plpgsql AS
$$
DECLARE 
	client_id int;
Begin
	INSERT INTO clients(name, email, password, created_at)
	VALUES( name_in, email_in, password_in, NOW())
	returning id into client_id;

	return client_id; 
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
	
END
$$;


--

-- creates or replaces a stored function called revoke_token 
-- returns a boolean
CREATE OR REPLACE FUNCTION revoke_token(
  token_in varchar
)
 RETURNS varchar
 LANGUAGE plpgsql AS
$$
DECLARE 
    result varchar;
Begin
	insert into revoked_tokens(token)
    values(token_in);

	return 'revoked'; 
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
	
END
$$;


-- creates or replaces a stored function called get_user_by_client_id
-- retrieves user profile data
CREATE OR REPLACE FUNCTION get_user_by_client_id_by_id(
    client_id_in int,user_id int default null
) 
    RETURNS TABLE (name varchar, email varchar, created_at timestamp, updated_at timestamp)
AS $$
BEGIN
return query
SELECT u.name, u.email, u.created_at, u.updated_at
    FROM users u
    LEFT JOIN clients c ON c.id = u.client_id
where c.id=client_id_in and u.id=user_id and u.status = 'Active';
END; $$ 
LANGUAGE 'plpgsql';






-- creates or replaces a stored function called update_user
-- updates user profile data
CREATE OR REPLACE FUNCTION update_user_by_client_id_by_id(
    client_id_in int,
    user_id int, 
    name_in varchar,
    email_in varchar

)
 RETURNS int
 LANGUAGE plpgsql AS
$$
#variable_conflict use_variable
DECLARE 
  
    result int := null;
   
Begin
    SELECT id FROM users WHERE id=user_id AND client_id=client_id_in
    into result;

    UPDATE users
        SET 
        name=name_in,
        email=email_in,
        updated_at=NOW()
    WHERE id=user_id;

    return result; 
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
END
$$;



-- creates or replaces a stored function called insert_user
-- inserts user profile data
CREATE OR REPLACE FUNCTION insert_user(
    client_id_in int,
    name_in varchar,
    email_in varchar

)
 RETURNS int
 LANGUAGE plpgsql AS
$$
#variable_conflict use_variable
DECLARE 
  
    result int := null;
   
Begin
   

    insert into users(name,email,client_id,created_at)
    values(name_in,email_in,client_id_in,NOW())
    returning id into result;

    return result; 
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
END
$$;


-- creates or replaces a stored function called get_password_client
-- returns the encrypted password
CREATE OR REPLACE FUNCTION get_password_client(
  email_in varchar
)
 RETURNS varchar
 LANGUAGE plpgsql AS
$$
DECLARE 
	pass varchar;
Begin
	select password into pass from clients where email=email_in ;


	return pass; 
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
	
END
$$;



-- creates or replaces a stored function called get_client_id
-- returns the id 
CREATE OR REPLACE FUNCTION get_client_id(
  email_in varchar
)
 RETURNS varchar
 LANGUAGE plpgsql AS
$$
DECLARE 
	result int;
Begin
	select id into result from clients where email=email_in ;


	return result; 
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
	
END
$$;


-- creates or replaces a stored function called archive_user
-- returns the archived message
CREATE OR REPLACE FUNCTION archive_user(
  user_id_in int,
  client_id_in int
)
 RETURNS varchar
 LANGUAGE plpgsql AS
$$
DECLARE 
    result int;
Begin
	update users 
    set status='Archived'
    where id=user_id_in and client_id=client_id_in;


	return user_id_in; 
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
	
END
$$;





-- creates or replaces a stored function called get_user_json
-- retrieves user profile json
CREATE OR REPLACE FUNCTION get_user_json(
    id_in int,
    client_id_in int
) 
    RETURNS text
AS $$
DECLARE
	json_text text := '';
BEGIN
SELECT json_strip_nulls(row_to_json(nested_u)) into json_text
FROM (
	SELECT u.name,u.email,u.created_at,u.updated_at
	from users u
	where id=id_in and client_id=client_id_in and u.status = 'Active'
	limit 1

) nested_u;

return json_text;
END; $$ 
LANGUAGE 'plpgsql';




-- creates or replaces a stored function called check_email_taken
-- returns a boolean
CREATE OR REPLACE FUNCTION check_email_taken(
  email_in varchar
)
 RETURNS boolean
 LANGUAGE plpgsql AS
$$
DECLARE 
	check boolean;
Begin
	select count(*)>0 into check from clients where email=email_in;


	return check; 
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
	
END
$$;



-- creates or replaces a stored function called get_user_table_patial_match_by_name
-- retrieves users list json
CREATE OR REPLACE FUNCTION get_user_table_patial_match_by_name(
    search varchar,
    client_id_in int
) 
   RETURNS TABLE (name varchar, email varchar, created_at timestamp, updated_at timestamp)
AS $$
BEGIN
    return query
	SELECT u.name ,u.email,u.created_at,u.updated_at
	from users u
	where client_id=client_id_in and u.status = 'Active' and u.name ILIKE CONCAT('%',search, '%');

END; $$ 
LANGUAGE 'plpgsql';
