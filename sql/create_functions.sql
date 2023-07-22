
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


-- creates or replaces a stored function called login_client
-- returns a boolean
CREATE OR REPLACE FUNCTION login_client(
  email_in varchar,
  password_in varchar
)
 RETURNS boolean
 LANGUAGE plpgsql AS
$$
DECLARE 
	connect boolean;
Begin
	select count(*)>0 into connect where email=email_in and password=password_in;


	return connect; 
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
	
END
$$;


-- creates or replaces a stored function called login_client
-- returns a boolean
CREATE OR REPLACE FUNCTION login_client(
  email_in varchar,
  password_in varchar
)
 RETURNS boolean
 LANGUAGE plpgsql AS
$$
DECLARE 
	connect boolean;
Begin
	select count(*)>0 into connect from clients where email=email_in and password=password_in;


	return connect; 
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
	
END
$$;


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




-- creates or replaces a stored function called get_user_json
-- retrieves supplier company profile json
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
